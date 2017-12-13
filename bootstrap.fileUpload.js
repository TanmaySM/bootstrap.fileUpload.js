(function ($) {

    $.fn.bsFileUpload = function (options) {

        var defaults = {
            browseButtonClass: "btn btn-lg",
            noFileSelectedLabelText: "No File Selected",
            accept: "jpg|jpeg|png|gif",
            maxFileSize:"10MB",
            browseButtonHTML: function (fileName) {
                return fileName;
            }
        };

        var settings = $.extend({}, defaults, options);
        var self = this;

        function onBrowseButtonClick(event) {
            $("#" + $(this).data("fu-file-control")).trigger("click");
        }

        function onFileInputChange(event) {
            var $fileUploadButton = $("#fileUpload" + this.id);
            var fileName = this.value.split('\\').pop();
            if (this.value != "" && validateFile(this.files[0])) {
                $fileUploadButton.html(settings.browseButtonHTML(fileName));
                showImage(event);
            }
            else {
                $fileUploadButton.html(settings.browseButtonHTML(settings.noFileSelectedLabelText));
            }
        }

        //validate File
        function validateFile(file) {
            var result = true;
            var errorMsg = '';
            if (file == undefined || !file.name.toLowerCase().match("\.(" + defaults.accept + ")$") || file.size == 0) {
                $(self).trigger("fu.acceptFail", [file])
                result = false;
            }
            var maxAllowedFileSize = getMaxFileSizeBytes();
            if ( file.size>maxAllowedFileSize ) {
                $(self).trigger("fu.maxFileSizeFail", [file])
                result = false;
            }
            return result;
        }

        function getMaxFileSizeBytes() {
            var unit = defaults.maxFileSize.slice(-2);
            var size = eval(defaults.maxFileSize.replace(unit, ""));
            var bytes = 0;
            switch(unit.toUpperCase())
            {
                case "KB":
                    bytes = size * (1024)
                    break
                case "MB":
                    bytes = size * (1024 * 1024)
                    break;
                case "GB":
                    bytes = size * (1024 * 1024 * 1024)
                    break;
                default:
                    console.log("Invalid file max size")
            }
            return bytes;
        }

        function showImage(event) {
            var reader = new FileReader();
            var self = event.target;
            reader.onload = function (e) {
                var img = $("<img />  ")
                .prop("id", "img" + self.id)
                .prop("src", e.target.result)
                .prop("width", "50")
                .data("fu-file-control", self.id)
                    .css("margin-right", "10px").hide()
                .prependTo($("#fileUpload" + self.id));

                // 'load' event
                $(img).on('load', function () {
                    $(this).show();
                });


            };
            reader.readAsDataURL(event.target.files[0]);
        }

        return self.each(function () {
            $(this).hide();
            // Retain an internal reference:
            var browseButton = $("<button />")
                .prop("id", "fileUpload" + this.id)
                .prop("class", settings.browseButtonClass)
                .data("fu-file-control", this.id)
                .prop("disabled", this.disabled)
                .html(settings.noFileSelectedLabelText)
                .insertAfter(this);

            browseButton.on("click", onBrowseButtonClick);

            //$(this).on("change", onFileInputChange);

            $(this).on("change", onFileInputChange);

          
        });

    };

}(jQuery));