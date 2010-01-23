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
    
    var p = OS.popen(cmd, { charset : options.charset });
    try {
        p.stdin.write(code).close();
        
        if (p.wait() !== 0)
            throw new Error("closure-compiler error: " + p.stderr.read());
    
        return p.stdout.read();
    } finally {
        p.stdin.close();
        p.stdout.close();
        p.stderr.close();
    }
}
