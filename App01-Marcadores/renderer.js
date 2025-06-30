const shell = require('electron');

class Marcadores {
    constructor() {
        this.mensajeError = document.querySelector(".mensaje-error");
        this.formularioCreacionMarcador = document.querySelector(".creacion-marcador-formulario");
        this.marcadorURL = document.querySelector('.creacion-marcador-url');
        this.marcadorBoton = document.querySelector('.creacion-marcador-boton');
        this.marcadores = document.querySelector('.marcadores');
        this.eliminarMarcadores = document.querySelector('.remover-marcadores');

        this.parser = new DOMParser();

        this.agregarEventListeners();
    }
    agregarEventListeners() {
        this.marcadorURL.addEventListener('keyup', () => {
            this.marcadorBoton.disabled = !this.marcadorURL.validity.valid;
        });
        this.formularioCreacionMarcador.addEventListener('click', this.crearMarcador.bind(this));
        this.eliminarMarcadores.addEventListener('click', this.eliminarMarcadoresCreados.bind(this));

        this.marcadores.addEventListener('click', this.abrirEnlaceMarcador.bind(this));
    }

    crearMarcador(event) {
        event.preventDefault();
        const url = this.marcadorURL.value;

        fetch(url)
            .then(response => response.text())
            .then(this.extraerContenido.bind(this))
            .then(this.encontrarTituloPagina)
            .then(titulo => this.alamcenarMarcador(url, titulo))
            .then(this.limpiarFormulario.bind(this))
            .then(this.visualizarMarcadores.bind(this))
            .catch(error => this.reportarError(error, url));
    }

    extraerContenido(contenido) {
        return this.parser.parseFromString(contenido, 'text/html');
    }

    encontrarTituloPagina(html) {
       return html.querySelector('title').innerText;
    }

    alamcenarMarcador(url, titulo) {
        localStorage.setItem(url, JSON.stringify({ titulo: titulo, url: url }));
    }

    limpiarFormulario() {
        this.marcadorURL.value = null;
    }

    obtenerMarcadores(){
        return Object.keys(localStorage).map(k => JSON.parse(localStorage.getItem(k)));
    }

    generarHtmlMarcador(marcador) {
        return `<li class="list-group-item">
                    <h4>${marcador.titulo}</h3><br>
                    <a href="${marcador.url}">${marcador.url}</a>
                </li>`;
    }

    visualizarMarcadores() {
        let marcadores = this.obtenerMarcadores();

        let html = marcadores.map(this.generarHtmlMarcador).join('');
        this.marcadores.innerHTML = `<ul class="list-group">${html}</ul>`;
    }

    reportarError(error, url) {
        this.mensajeError.classList.remove('invisible');
        this.mensajeError.innerText = `Ocurrio un error al intentar acceder a ${url}: ${error}`;
        
        setTimeout(() => {
            this.mensajeError.innerText = null;
            this.mensajeError.classList.add('invisible');
        }, 5000);
    }

    eliminarMarcadoresCreados() {
        localStorage.clear();

        this.marcadores.innerHTML = '';
    }

    abrirEnlaceMarcador(evento) {
        if (evento.target.href) {
            evento.preventDefault();
            shell.shell.openExternal(evento.target.href);
        }
    }
}

let marcadores = new Marcadores();
marcadores.visualizarMarcadores();