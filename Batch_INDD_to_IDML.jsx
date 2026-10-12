#target "InDesign"

// Batch-export INDD documents in a selected folder and its subfolders to IDML.
// Originals are never saved or changed. Existing IDMLs are skipped.
(function () {
    var root = Folder.selectDialog("Select the folder containing your INDD files (subfolders included)");
    if (!root) return;

    var oldInteraction = app.scriptPreferences.userInteractionLevel;
    var oldCheckLinks = app.linkingPreferences.checkLinksAtOpen;
    var logFile = new File(root.fsName + "/INDD_to_IDML_conversion_log.txt");
    var files = [];
    var succeeded = 0, skipped = 0, failed = 0;
    var logLines = ["Batch INDD to IDML - " + new Date().toString(), "Folder: " + root.fsName, ""];

    function collect(folder) {
        var entries = folder.getFiles();
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (entry instanceof Folder) {
                collect(entry);
            } else if (entry instanceof File && /\.indd$/i.test(entry.name) && !/^~/.test(entry.name)) {
                files.push(entry);
            }
        }
    }

    function writeLog() {
        try {
            logFile.encoding = "UTF-8";
            if (logFile.open("w")) {
                logFile.write(logLines.join("\r\n"));
                logFile.close();
            }
        } catch (ignore) {}
    }

    try {
        collect(root);
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
        app.linkingPreferences.checkLinksAtOpen = false;

        for (var j = 0; j < files.length; j++) {
            var source = files[j];
            var output = new File(source.parent.fsName + "/" + source.name.replace(/\.indd$/i, ".idml"));
            var doc = null;

            if (output.exists) {
                skipped++;
                logLines.push("SKIP (IDML exists): " + source.fsName);
                continue;
            }

            try {
                doc = app.open(source, false);
                doc.exportFile(ExportFormat.INDESIGN_MARKUP, output);
                if (!output.exists || output.length === 0) {
                    throw new Error("No nonempty IDML was created");
                }
                succeeded++;
                logLines.push("OK: " + output.fsName);
            } catch (err) {
                failed++;
                logLines.push("FAILED: " + source.fsName + " | " + err);
            } finally {
                if (doc !== null) {
                    try { doc.close(SaveOptions.NO); } catch (closeError) {
                        logLines.push("WARNING (could not close): " + source.fsName + " | " + closeError);
                    }
                }
            }
            // Persist progress after each file, even if processing is interrupted.
            if (j % 10 === 0) writeLog();
        }
    } catch (fatal) {
        logLines.push("FATAL: " + fatal);
    } finally {
        try { app.linkingPreferences.checkLinksAtOpen = oldCheckLinks; } catch (e1) {}
        try { app.scriptPreferences.userInteractionLevel = oldInteraction; } catch (e2) {}
        logLines.push("", "TOTAL INDD: " + files.length,
                      "EXPORTED: " + succeeded, "SKIPPED (already exists): " + skipped,
                      "FAILED: " + failed);
        writeLog();
    }

    alert("INDD to IDML batch finished.\n\nFound: " + files.length +
          "\nExported: " + succeeded + "\nSkipped: " + skipped +
          "\nFailed: " + failed + "\n\nLog: " + logFile.fsName);
}());
