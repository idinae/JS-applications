window.addEventListener('load', () => {
    const app = Sammy('#container', function () { //трябва да е function, не arrow, за да имаме this
        this.get('/', home);
        this.get('index.html', home);
        this.get('#/home', home);

        

    });

    app.run();

// function home() {
//     this.swap('<h1>Sammy is working!<h1>');
// }



});