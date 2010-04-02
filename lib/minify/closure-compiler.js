var OS = require("os");
var FILE = require("file");

exports.jarPath = FILE.path(module.path).dirname().dirname().dirname().join("compiler.jar");

exports.compress = function(code, options) {
    options = options || {};
    options.charset = options.charset || "UTF-8";

    var cmd = [
        "java",
        "-jar", exports.jarPath,
        "--charset", options.charset
    ];

    // pipe stderr to /dev/null to prevent it from hanging when the buffer fills up
    var cmdString = cmd.map(OS.enquote).join(" ") + " 2> /dev/null";
    var p = OS.popen(cmdString, { charset : options.charset });

    try {
        var bytes = code.toByteString(options.charset);
        for (var i = 0; i < bytes.length; i += 1024)
            p.stdin.raw.write(bytes.slice(i, i+1024));
        p.stdin.close();

        var result = p.stdout.read();

        if (p.wait() !== 0)
            throw new Error("closure-compiler error");

        return result;

    } finally {
        p.stdin.close();
        p.stdout.close();
        p.stderr.close();
    }
}
