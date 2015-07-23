Mapker third party librairies.

## Add a new deps via Bower  

Just use the install command with the --save parameter  
`$ bower install my-package --save`  

Then, update the package.js file by adding the files you need for your app.  
You should have something like this:  


    ...
    Package.onUse(function(api) {

      api.versionsFrom('1.1.0.2');

      api.addFiles([
        // Selectize.js: https://github.com/brianreavis/selectize.js
        // Required globally
        'bower_components/selectize/dist/js/selectize.min.js',
        'bower_components/selectize/dist/js/selectize.bootstrap3.css'
      ], ['client']);

    });
    ...

Don't forget to indicate which package rely on it
