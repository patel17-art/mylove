var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var offsetX, offsetY;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    // 1. Setup Garden
    var $loveHeart = $("#loveHeart");
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    
    // Set canvas size based on the CSS container
    gardenCanvas.width = $loveHeart.width();
    gardenCanvas.height = $loveHeart.height();
    
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

    // 2. Position the content container
    $("#content").css("width", $loveHeart.width() + $("#code").width());
    $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // 3. Render Loop (Keeps the heart visible)
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
    // Re-calculate offsets to ensure heart is centered
    offsetX = $("#loveHeart").width() / 2;
    offsetY = $("#loveHeart").height() / 2 - 55;
    
    var interval = 50;
    var angle = 10;
    var heart = new Array();
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle);
        var draw = true;
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }
        if (angle >= 30) {
            clearInterval(animationTimer);
            showMessages();
        } else {
            angle += 0.2;
        }
    }, interval);
}

function timeElapse(date){
    var current = new Date(); // Fixed from Date() string to object
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
    var days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    var hours = Math.floor(seconds / 3600);
    if (hours < 10) hours = "0" + hours;
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10) minutes = "0" + minutes;
    seconds = seconds % 60;
    if (seconds < 10) seconds = "0" + seconds;
    
    var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds"; 
    $("#elapseClock").html(result);
}

// ... (Rest of your helper functions: showMessages, adjustWordsPosition, etc. stay the same)

function showMessages() {
	adjustWordsPosition();
	$('#messages').fadeIn(5000, function() {
		showLoveU();
	});
}

function adjustWordsPosition() {
	$('#words').css("position", "absolute");
	$('#words').css("top", $("#garden").position().top + 195);
	$('#words').css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
	$('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
	$('#loveu').fadeIn(3000);
}

// Typewriter Plugin
(function($) {
    $.fn.typewriter = function() {
        this.each(function() {
            var $ele = $(this), str = $ele.html(), progress = 0;
            $ele.html('');
            var timer = setInterval(function() {
                var current = str.substr(progress, 1);
                if (current === '<') progress = str.indexOf('>', progress) + 1;
                else progress++;
                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) {
                    clearInterval(timer);
                    $ele.html(str);
                }
            }, 75);
        });
        return this;
    };
})(jQuery);

// Password Event Listener
document.addEventListener("click", function (e) {
    const heartLink = e.target.closest("#heartspan a");
    if (!heartLink) return;

    e.preventDefault();
    const overlay = document.getElementById("passwordOverlay");
    const input = document.getElementById("passwordInput");
    const error = document.getElementById("errorMs");
    const unlockBtn = document.getElementById("unlockBtn");

    overlay.style.display = "flex";
    input.value = "";
    error.style.display = "none";
    input.focus();

    unlockBtn.onclick = function () {
        const entered = input.value.trim();
        if (entered === "Hilove") {
            window.open("gallery.html", "_blank");
            overlay.style.display = "none";
        } else if (entered === "hi") {
            window.open("gallery2.html", "_blank");
            overlay.style.display = "none";
        } else {
            error.style.display = "block";
            input.classList.add("shake");
            setTimeout(() => input.classList.remove("shake"), 500);
        }
    };
}, true);