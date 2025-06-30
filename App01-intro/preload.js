function establecerVersion(idSelector, version) {
    let elemento = document.getElementById(idSelector);
    if (elemento) {
        elemento.innerText = version;
    }
}
window.addEventListener('DOMContentLoaded', () => {
    const componentes = [
        'Chrome',
        'Node',
        'Electron'
    ];
    for (const componente of componentes) {
        establecerVersion(`${componente}-version`, process.versions[componente.toLocaleLowerCase()]);
    }
});