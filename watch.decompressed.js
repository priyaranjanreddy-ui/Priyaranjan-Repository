let isMobile = false;

$(document).ready(function() {
    $('#view-comments, #hide-comments, #add-comment').click(function() {
        $('#wide-screen-comment-section, #view-comments, #add-comment, #hide-comments').toggle();
        $('#join-conversation').toggleClass('d-none').toggleClass('d-flex');

        if ($(this).attr('id') === 'add-comment') {
            $('#commenting-wrapper')[0].scrollIntoView({block: "start", behavior: "smooth"});
        }

        if ($(this).attr('id') === 'view-comments') {
            window.Livewire.hook('message.processed', (message, component) => {
                initializeTooltips();
            });
        }

        if ($(this).attr('id') === 'view-comments') {
            const scrollToElement = $('.comment-row')[1] || $('.comment-row')[0];

            if (scrollToElement !== undefined) {
                scrollToElement.scrollIntoView({block: "start", behavior: "smooth"});
            }
        }
    });
});

function initializeTooltips() {
    $('[data-toggle="tooltip"]').tooltip({trigger: 'manual', animation: true, html: true})
        .on('mouseenter', function () {
            var _this = this;
            $(this).tooltip('show');
            $(_this).on('mouseleave', function () {
                if (!$('.tooltip:hover').length) {
                    if ($('<div>' + $(_this).data('original-title') + '</div>').find('a').length !== 0) {
                        setTimeout(function () {
                            $(_this).tooltip('hide');
                        }, 500);
                    } else {
                        $(_this).tooltip('hide');
                    }
                }
            });
        });
}

function expandToggle() {
    minifiedPlayerShift();
    if (document.body.clientWidth >= 992) {
        let expanded = $('#video-frame').hasClass('col-lg-12');
        if (!expanded) {
            if ($('#info-frame').hasClass('commenting-enabled')) {
                $('#video-frame').removeClass('col-lg-8');
                $('#info-frame').removeClass('col-lg-4');
            } else {
                $('#video-frame').removeClass('col-lg-9');
                $('#info-frame').removeClass('col-lg-3');
            }
            $('#video-frame').addClass('col-lg-12');
            $('#info-frame').hide();
            $('#arrowRight').hide();
            $('#arrowLeft').show();
        } else {
            if ($('#info-frame').hasClass('commenting-enabled')) {
                $('#video-frame').addClass('col-lg-8');
                $('#info-frame').addClass('col-lg-4');
            } else {
                $('#video-frame').addClass('col-lg-9');
                $('#info-frame').addClass('col-lg-3');
            }
            $('#video-frame').removeClass('col-lg-12');
            $('#info-frame').show();
            $('#info-frame').removeClass('d-none');
            $('#arrowRight').show();
            $('#arrowLeft').hide();
        }
    }
    printsize();
}

function preparePlayer(isCommentingEnabled, hasAiTimeline) {
    const player = $("#screencast-video").contents();
    const videojs = document.getElementById('screencast-video').contentWindow.videojs;
    const bannerHeight = $(".advert-banner").length === 0
        ? 0
        : $(".advert-banner").outerHeight();
    let buttonsHeight = 0;

    if (document.body.clientWidth < 992) {
        if (!isMobile && isCommentingEnabled) {
            Livewire.emit('updateActiveView', 'mobile');
            isMobile = true;
        }
        $('#info-frame').show();

        $('#screencast-video').height($('#screencast-video').width() / 16 * 9);

        if ($('#comments').children().length > 0 && !hasAiTimeline) {
            $('.tab-button').removeClass('col-6').addClass('col-4');
        }

        player.find('#overlay').addClass('d-none');
        player.find('#overlay-background').addClass('d-none');
    } else {
        if (isMobile && isCommentingEnabled) {
            Livewire.emit('updateActiveView', 'full');
            isMobile = false;
        }

        if ($('#toggle-comments-buttons-section').length > 0) {
            buttonsHeight = $('#toggle-comments-buttons-section').outerHeight(true);
        }

        $('#screencast-video').height(
            $('body').height()
            - $('#top-bar').height()
            - buttonsHeight
            - bannerHeight
            - 10
        );

        if ($('#tab-comments-button').hasClass('active')) {
            if (hasAiTimeline) {
                showTab('timeline');
            } else {
                showTab('transcript');
            }
        }
        $('.tab-button').removeClass('col-4').addClass('col-6');

        player.find('#overlay').removeClass('d-none');
        player.find('#overlay-background').removeClass('d-none');
    }

    if (videojs && videojs.getPlayer('mp4Player')) {
        if (
            videojs.getPlayer('mp4Player').paused() &&
            player.find('#overlay-background').css('display') === 'none'
        ) {
            player.find('.vjs-big-play-button').attr('style', 'display: block !important');
        } else if ($('.overlayTitle') > 0) {
            player.find('.vjs-big-play-button').attr('style', 'display: none !important');
        }
    }
}

function showTab(tab) {
    const scrollY = window.scrollY;

    if (tab === 'timeline') {
        $('#timeline').fadeIn();
        if (document.body.clientWidth < 992) {
            $('#comments').hide();
            $('#tab-timeline-button').addClass('active');
            $('#tab-comments-button').removeClass('active');
        }
    } else if (tab === 'transcript') {
        $('#transcripts').fadeIn();
        $('#notes').hide();
        $('#comments').hide();
        $('#tab-transcripts-button').addClass('active');
        $('#tab-notes-button').removeClass('active');
        $('#tab-comments-button').removeClass('active');
    } else if (tab === 'notes') {
        $('#notes').fadeIn();
        $('#transcripts').hide();
        $('#comments').hide();
        $('#tab-notes-button').addClass('active');
        $('#tab-transcripts-button').removeClass('active');
        $('#tab-comments-button').removeClass('active');
    } else if (tab === 'comments') {
        Livewire.emit('setPublic');
        $('#comments').fadeIn();
        if (document.body.clientWidth < 992) {
            $('#timeline').hide();
            $('#transcripts').hide();
            $('#notes').hide();
        }
        $('#tab-comments-button').addClass('active');
        $('#tab-notes-button').removeClass('active');
        $('#tab-timeline-button').removeClass('active');
        $('#tab-transcripts-button').removeClass('active');
    }

    // #23559 Preserve scroll position when switching tabs in landscape view on mobile and tablet devices
    if (window.innerWidth < 992 && window.matchMedia("(orientation: landscape)").matches) {
        setTimeout(() => window.scrollTo(0, scrollY), 0);
    }
}

function startAt(time) {
    let player = document.getElementById('screencast-video').contentWindow.videojs.getPlayer('mp4Player');
    document.getElementById('video-frame').scrollTo(0, 0);

    // If the time passed is a string containing a colon (h:m:s)
    // calculate the number of seconds that represents
    if (typeof time === 'string' && time.indexOf(':') > -1) {
        if (time.charAt(0) === ':') {
            // Strip a leading ':' character if we only have seconds
            time = time.substring(1);
        }

        // Split the time into an array and reverse so order is seconds, minutes, hours
        var segments = time.split(':').reverse();

        // Grab the seconds (we'll always have seconds)
        time = parseInt(segments[0]);

        // Add in the minutes
        if (segments.length > 1) {
            time += parseInt(segments[1]) * 60;
        }

        // Add in the hours
        if (segments.length === 3) {
            time += parseInt(segments[2]) * 3600;
        }
    }

    // Begin playback before setting time to coax Safari to jump to the correct time
    var startedAt = false;
    player.currentTime(time);
    if (player.restoreControls) {
        player.controls(true);
    }
    if (!player.playing) {
        player.play();
        player.currentTime(time);
        if (!player.playing) {
            // Kickstart playing (for Mac/iOS)
            player.on('canplaythrough', function() {
                if (!startedAt) {
                    player.currentTime(time);
                    startedAt = true;
                }
            });
        }
    }

    return false;
}

function changeTranscript(encodedId) {
    prepareTranscripts($('#caption-choice').val(), encodedId);
}

function prepareTranscripts(url, encodedId){
    var transcriptsContent = '<div class="col col-md-12">';
    var checkResponse = function (response) {
        transcriptsContent = transcriptsContent + parseTranscripts(response, encodedId);

        if(transcriptsContent == '<div class="col col-md-12">'){
            transcriptsContent = transcriptsContent + 'No transcript';
        }
        transcriptsContent = transcriptsContent + '</div>';
        $('#transcript-data').html(transcriptsContent);
    }

    // If no url then pretend we got empty response. #16979
    if (url === '') {
        checkResponse('');
        return;
    }

    // Else make the request...
    $.ajax({
        method: "GET",
        url: url,
        success: checkResponse
    });

}

function parseTranscripts(string, encodedId) {
    var content = line = startTime = text = misc = "";
    var lines = string.split("\n");

    if (lines[0] == '<!doctype html>'){
        // No captions found
        return "";
    }

    captionData = [];
    for (var i = 1; i < lines.length; i++) {
        startTime = "";
        text =  "";
        misc = parseInt(lines[i].trim().replace(/[^ -~]+/g, ""));
        if ((misc !== NaN && (misc + '') === lines[i].trim().replace(/[^ -~]+/g, "")) || lines[i].trim().length === 0) {
            // Line number or blank line
            if (i != 1 && i != lines.length - 1 && lines[i].trim().length === 0) {
                // Blank line - Close "section" with an HR
                text = text.trim().replace(/\>/g, "&gt;") + '<hr>';
                content = content + text;
            }
            // If we have a line that only contains a numeric value we ignore it
            continue;
        }

        line = lines[i];
        if (line.includes('-->')) {
            // The line is a time range - collect the starting time
            startTime = cleanTime(lines[i].split('-->')[0].trim());
        } else {
            // The line contains caption text
            text = line;
        }

        if (startTime != '') {
            let timeArray = startTime.split(':');
            let linkTime = parseInt(timeArray[0] * 60 + timeArray[1], 10);

            content = content +
                `<a
                    href="${window.location.origin}/watch/${encodedId}?sec=${linkTime}"
                    onClick="return startAt('${startTime}')"
                    data-screenpal-ignore=true
                    class="font-weight-bold"
                >${startTime}
                </a> `;
        }
        content += ' ' + text;
    }

    return content;
}

function printsize() {
    let bodyHeight = document.body.clientHeight;
    let topBarHeight = $("#top-bar").length === 0 ? 0 : $("#top-bar").height();
    let editBoxHeight = $("#edit-box").length === 0 ? 0 : $("#edit-box").outerHeight();
    let bannerHeight = $(".advert-banner").length === 0 ? 0 : $(".advert-banner").outerHeight();
    let titleAndDurationHeight = $("#title-and-duration") ? $("#title-and-duration").outerHeight() : 0;
    let tabsRowHeight = $('#tabs-row') ? $('#tabs-row').outerHeight() : 0;
    let infoBoxPadding = 30;
    let sidebarContentDown = $(".sidebar-content-down").length === 0 ? 0 : 20;
    if (document.body.clientWidth >= 992) {
        $("#video-frame").height(bodyHeight - topBarHeight - bannerHeight - titleAndDurationHeight);
        $("#info-list").height(bodyHeight - topBarHeight - bannerHeight - editBoxHeight - tabsRowHeight - infoBoxPadding - sidebarContentDown);
    }
}

function selectVideo(id) {
    $(".selectVideo").removeClass('selectedVideo');
    $("#" + id).addClass('selectedVideo');
    window.location.href = '/watch/' + id;
}

function secToClock(seconds) {
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    if (seconds < 10) seconds = "0" + seconds;
    if (minutes == 0) minutes = "00";
    return minutes + ":" + seconds;
}

function cleanTime(time) {
    time = time.split('.')[0];
    while (time != (time = time.replace(/^(0:|00:)/g, '')));

    if (time.length < 3) {
        // If we only have seconds we want to return 0:SS
        time = '0:' + time.padStart(2, '0')
    } else if (time.charAt(0) === '0') {
        // Otherwise strip any leading zeros
        time = time.substring(1);
    }

    return time;
}
