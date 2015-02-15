TradeZ.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        
                        if (! loadEvent.target.result) {
                            scope.filtered = '';
                            return;
                        }

                        if (loadEvent.target.result.length > 10240) {
                            console.log(loadEvent.target.result.length);
                            scope.filtered = '<File To Large>';
                            return;
                        }

                        var base64Data = loadEvent.target.result.split(';base64,');
                        scope.fileread = (base64Data[1]) ? atob(base64Data[1]) : '';
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);