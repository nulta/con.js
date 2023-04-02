let con = {}

window.baseURI = window.baseURI || document.currentScript.src.replace(/\/[^/]+?\/[^/]+?$/, "/")

con._playKeySound = function() {
    fxDirector.playSound("key1.ogg")
}

con._playEnterSound = function() {
    fxDirector.playSound("key2.ogg")
}

con._playTextSound = function() {
    fxDirector.playSound("key3.ogg", 0.7)
}

con._startStdin = function(maxLength, isPassword) {
    $("#con")
        .append(`<input id="stdin" class="stdin" spellcheck="false" style="width: 0" autocomplete="off">`)
        // .append(`<span class="stdin-caret">`)
    $("#stdin").trigger("focus")

    if (isPassword) {
        $("#stdin").addClass("pw-input")
    }
    if (maxLength) {
        $("#stdin").attr("maxlength", maxLength)
    }

    con._useCaret(true)
}

con._endStdin = function() {
    let val = $("#stdin").val()
    if ($("#stdin").hasClass("pw-input")) {
        val = ""
    }
    $("#stdin").replaceWith(val + "\n")
    // $(".stdin-caret").remove()
    con._useCaret(false)
    con._normalize()
}

con._waitForStdin = async function() {
    return new Promise((resolve) => {
        $("#stdin").on("keydown", (e) => {
            // On Enter key
            if (e.key !== "Enter") return;

            con._playEnterSound()
            let val = $("#stdin").val()
            $("#stdin").off("keydown")
            con._endStdin();
            resolve(val);
        });
    });
}

con._normalize = function() {
    $("#con")[0].normalize()
}

con._useCaret = function(bool) {
    if (bool) {
        $("#con").addClass("with-caret")
    } else {
        $("#con").removeClass("with-caret")
    }
}

con.input = async function(text, maxLength, isPassword) {
    con.printf(text || "")
    con._startStdin(maxLength, isPassword)
    return await con._waitForStdin()
}

con.printf = function(text) {
    $("#con").append(text)
    $("#con").scrollTop($("#con")[0].scrollHeight)
    con._normalize()
}

con.println = function(text) {
    text = (text === undefined) ? "" : text
    con.printf(text + "\n")
}

// Write text using typewriter effect
con.write = async function(text, playSound, ms) {
    ms = (ms === undefined) ? 30 : ms
    playSound = (playSound === undefined) ? true : playSound
    con._useCaret(true)

    for (let i = 0; i < text.length; i++) {
        const char = $(`<span class='last-char'>`).text(text[i]).appendTo("#con");
        if (playSound) con._playTextSound();

        if (text[i] === "\n") {
            await con.sleep(ms * 3);
        }
        await con.sleep(ms);

        setTimeout(() => {
            if (char) char.replaceWith(text[i])
        }, 0.1 * 1000)
    }

    con._useCaret(false)
    con._normalize()
}

con.writeln = async function(text, ms, playSound) {
    await con.write(text + "\n", ms, playSound)
}

con.clear = function() {
    $("#con").html("")
}

con.sleep = async function(ms) {
    return new Promise(r => setTimeout(r, ms))
}

// HTML Bindings //

$("body")
    .on("keydown", (ev) => {
        if ($("#stdin").length) {
            $("#stdin").trigger("focus")
        }
    })

$("#con")
    .on("keydown", "#stdin", (ev) => {
        $(ev.target).prop("selectionStart", $("#stdin").val().length)
        $(ev.target).prop("selectionEnd", $("#stdin").val().length)
    })
    .on("input", "#stdin", (ev) => {
        const span = document.createElement("span")
        span.className = "hidden-text-measure"
        span.innerText = ev.currentTarget.value
        document.body.append(span)

        ev.currentTarget.style.width = span.scrollWidth + "px"

        span.remove()
        con._playKeySound()
    })

$("#stdin").trigger("focus")