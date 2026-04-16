# Módulo 08: Docker Desktop

**Fuente:** Curso Docker 2024 - modulo8
**Autor:** José Domingo González López
**URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo8
**URL GitHub:** https://github.com/josedom24/curso_docker_ow



---

# Gestión de creación de imágenes en Docker Desktop

## La vista de construcción de imágenes

La vista de construcción de imágenes es una interfaz sencilla que le permite inspeccionar su historial de construcciones y gestionar las construcciones utilizando Docker Desktop.

Podemos ver el historial de construcciones realizadas y la construcción activa que se está realizando en este momento.

![build](img/build1.png)

Si accedemos al detalle de la construcción activa, sólo podremos acceder a los logs de la construcción:

![build](img/build2.png)

## Inspeccionar construcción

Si accedemos a la información a una construcción ya finalizada podemos obtener la siguiente información:

* **Info**: Nos muestra información de la construcción:
    * **Source details**:  Nos muestra información sobre el fichero `Dockerfile` por ejemplo el repositorio donde se encuentra.
    * **Build timing**: La sección Tiempo de compilación contiene gráficos que muestran información de la construcción:
        * El tiempo real se refiere al tiempo total de construcción.
        * El tiempo acumulado muestra el tiempo total de uso de CPU para realizar la construcción.
        * El uso de caché muestra información sobre el almacenamiento en caché de la construcción.
        * La ejecución paralela muestra cuánto tiempo de ejecución de la compilación se dedicó a ejecutar pasos en paralelo.
    * **Dependencies**: La sección Dependencias muestra imágenes y recursos remotos utilizados durante la construcción:
        * Imágenes de contenedores utilizadas durante la construcción.
        * Repositorios Git incluidos mediante la instrucción `ADD` en el fichero `Dockerfile`.
        * Recursos HTTPS remotos incluidos mediante la instrucción `ADD` en el fichero `Dockerfile`.
    * **Configuration**: Nos muestra los parámetros pasados a la construcción:
        * Argumentos de construcción.
        * Etiquetas.
        * ...
    * **Build results**: Nos muestra un resumen de los artefactos de compilación generados.
* **Source**: Nos muestra el fichero `Dockerfile` usado para la construcción. Si hay un error en la construcción nos señalará el error en esta pestaña.
* **Logs**: Nos muestra la salida de la ejecución de los distintos pasos que se ejecutan en la construcción y están indicados en el fichero `Dockerfile`.
* **History**: La pestaña Historial muestra datos estadísticos sobre las construcciones completadas. El gráfico ilustra las tendencias en la duración, los pasos de compilación y el uso de la caché para las distintas construcciones.

![build](img/build3.png)

---

# Gestión de contenedores en Docker Desktop

## Ejecución de contenedores

Partiendo de una imagen que tengamos en el registro local podemos ejecutar un nuevo contenedor con la opción **Run**. Podemos crear contenedores desatendidos (opción `-d` en `docker run`) y los datos que podemos configurar son los siguientes:

* El nombre del contenedor.
* El mapeo de puertos.
* El almacenamiento, volúmenes docker o bind mount.
* Las variables de entorno.

![contenedor](img/contenedor1.png)

## Listado de contenedores

Al entrar en la vista de contenedores, vemos los contenedores que tenemos creados, con la siguiente información:

* Los recursos que están utilizando nuestros contenedores (CPU y memoria RAM).
* El nombre e identificados de los contenedores.
* La imagen desde la que se ha creado.
* El estado (En ejecución, parado, ...).
* El porcentaje de CPU que está utilizando.
* El mapeo de puertos. si pulsamos sobre esta información se abrirá el navegador y nos permitirá acceder a la aplicación que sirve el contenedor.
* El tiempo desde que se creó.

![contenedor](img/contenedor2.png)

Las tareas que podemos ejecutar con los contenedores son **iniciar/parar** el contenedor, **eliminar** el contenedor y las siguientes que encontramos en el menú de acciones:

![contenedor](img/contenedor3.png)

* **View details**: Nos da información del contenedor. Lo veremos en el siguiente apartado.
* **View packages and CVEs**: Nos lleva a la información de la imagen, donde entre otras cosas podremos ver los ficheros y las vulnerabilidades de la imagen.
* **Copy docker run**: Nos permite copiar en el portapapeles la instrucción `docker run` que crea el contenedor.
* **Open in terminal**: Nos permite acceder interactívamente al contenedor.
* **View files**: Nos permite ver los ficheros que hay en el sistema de archivos del contenedor.
* **Pause**: Nos permite pausar el contenedor.
* **Restart**: Nos permite reiniciar el contenedor.
* **Open with browser**: Nos permite acceder a la aplicación en un navegador web.

## Inspeccionar un contenedor

Si pulsamos sobre el nombre de un contenedor, nos aparece una pantalla donde podemos ver distintas informaciones del contenedor:

* **Logs**: Obtenemos los logs del contenedor.
* **Inspect**: Obtenemos información detallada del contenedor. Podemos selección determinada información que nos interesa.
* **Bind mounts**: Obtenemos los directorios que tenemos montados en el contenedor.
* **Exec**: Nos permite acceder interactívamente al contenedor.
* **Files**: Obtenemos las lista de ficheros que tiene el contenedor y nos indica cual ha sido modificado.
* **Stats**: Nos mustra distintas gráficas de uso de recursos (CPU, memoria RAM, lectura/escritura de disco, E/S de red,...).

![contenedor](img/contenedor4.png)

## Docker Compose en Docker Desktop

Cuando levantamos un escenario con Docker Compose, podemos visualizar el escenario que hemos levantado y los contenedores que se han creado. Los escenarios, podemos iniciarlos o pararlos, y eliminarlos. Además podemos ver el detalle del escenario, donde se nos mostrará la lista de contenedores y los logs de los mismos.

![contenedor](img/contenedor5.png)


---

# Extensiones en Docker Desktop

Las extensiones nos permiten añadir nuevas funcionalidades a Docker Desktop. Al acceder a la vista de extensiones podemos [buscar en un repositorio](https://hub.docker.com/search?q=&type=extension) las distintas extensiones que distintas empresas han desarrollado y la podemos instalar. Veamos algunos ejemplos de extensiones:

## Disk usage

Esta extensión nos permite optimizar el almacenamiento, ya que además de mostrar de forma gráfica el almacenamiento que estamos utilizando con los objetos Docker, podemos eliminar los objetos que no estemos utilizando.

![extensiones](img/extension1.png)

## Logs Explorer

Esta extensión nos permite centralizar la visualización de los logs de los contenedores. Además nos posibilita filtrar y realizar búsquedas en los logs.

![extensiones](img/extension2.png)

## Resource usage

Esta extensión nos permite monitorizar en vivo los recursos usados por los contenedores (CPU, memoria RAM, red y disco,...).

![extensiones](img/extension3.png)

## Volumes Backup & Share

Esta extensión nos permite varias tareas:

* Exportar un volumen: a un archivo comprimido, a una imagen, ...
* Importar datos a un nuevo volumen.
* Transferir un volumen a través de SSH a otro host que ejecute Docker Desktop o Docker engine.
* Clonar, vaciar o eliminar un volumen

![extensiones](img/extension4.png)
---

# Gestión de imágenes en Docker Desktop

## Descargas de imágenes

Docker Desktop nos permite buscar cualquier imagen de Docker Hub. Una vez elegida la imagen podemos ver distinta información de ella:

* Su identificador.
* Las etiquetas.
* La fecha de creación.
* El tamaño de la imagen.
* La documentación.

Las tareas que podemos realizar sobre la imagen que hemos buscado serán:

* **Pull**: Nos permite bajar la imagen a nuestro registro local.
* **Run**: Nos permite crear un contenedor a partir de esta imagen.

![imágenes](img/imagen1.png)

## Listado de imágenes

Al acceder a la vista de imágenes, podemos ver un listado de imágenes:

* En la pestaña **Local** vemos las imágenes descargadas en nuestro registro local. Podemos acceder a distinta informaciones:
    * El nombre y el identificador.
    * La etiqueta de la imagen.
    * El estado: si está en uso o no.
    * El tiempo de creación.
    * El tamaño.

    Además podemos ver las acciones que podemos realizar sobre la imagen:

    * **Run**: Nos permite la ejecución de un contenedor.
    * **View packages and CVEs**: Nos lleva a la información de la imagen, donde entre otras cosas podremos ver los ficheros y las vulnerabilidades de la imagen.
    * **Pull**: Nos permite bajar la imagen a nuestro registro local si ha sido modificada.
    * **Push to Hub**: Nos permite subir la imagen a Docker Hub.
    * **Delete**: Nos permite borrar la imagen del registro local.
* En la pestaña **Hub**, si estamos logueados podemos visualizar nuestras imágenes subidas a Docker Hub y realizar las siguientes tareas:
    * **View en Hub**: Te lleva a la página web de la imagen seleccionada en Docker Hub.
    * **Pull**: Nos permite bajar la imagen a nuestro registro local.

![imágenes](img/imagen2.png)

## Inspeccionar una imagen

Si pulsamos sobre el nombre de una imagen, nos aparece una pantalla donde podemos ver distintas informaciones de la imagen:

* **Image hierarchy**: Los comandos que se han ejecutado para crear la imagen. Similar al comando `docker history`.
* **Vulnerabilidades**: Lista de vulnerabilidades encontradas en los distintos paquetes instalados en la imagen.
* **Paquetes**: Lista de paquetes que tiene instalada la imagen.


![imágenes](img/imagen3.png)

---

# Introducción a la interfaz de Docker Desktop

Cuando abrimos la aplicación Docker Desktop, tenemos a nuestra disposición una aplicación gráfica llamada Docker Dashboard:

![docker desktop](img/desktop.png)


## Funciones principales

* **Contenedores**:

    * La vista de contenedores nos permite gestionar nuestros contenedores.
    * Podemos gestionar el ciclo de vida de los contenedores (inicio, parada, reinicio,...).
    * Nos permite realizar tareas comunes sobre los contenedores: inspeccionar, acceder al terminal, ver los logs, ...

* **Imágenes**:

    * Esta vista nos permite gestionar las imágenes.
    * Podemos ver las imágenes que tenemos en el registro local y nuestras imágenes en Docker Hub si estamos logueados.
    * Nos permite ejecutar contenedores a partir de las imágenes.
    * Nos muestra un resumen de las vulnerabilidades de las imágenes.

* **Volúmenes**:

    * Nos permite ver la lista de volúmenes Docker que tenemos creados.
    * También nos permite crear nuevos volúmenes.

* **Builds**:

    * En esta vista podemos inspeccionar el historial de construcciones de imágenes.
    * Nos permite gestionar las construcciones en curso.
* **Extensions**:
    * Las extensiones nos permiten añadir nuevas funcionalidades a Docker Desktop.

## Otras funciones

* **Menú Configuración** para configurar los ajustes de Docker Desktop.
* **Menú Solucionar problemas** para depurar y realizar operaciones de reinicio. 
* **Recibir notificaciones** sobre nuevas versiones, actualizaciones, ...
* **Centro de aprendizaje** nos permite acceder a documentación sobre Docker.
* **Dev Environments** nos permite crear entornos de desarrollo que se ejecutan en contenedores.
* **Docker Scout** nos permite examinar imágenes para encontrar posibles vulnerabilidades.

## Panel de búsqueda

Podemos buscar:
* Cualquier contenedor o aplicación Compose en tu sistema local. Puedes ver un resumen de las variables de entorno asociadas o realizar acciones rápidas, como iniciar, detener o eliminar.
* Imágenes públicas de Docker Hub, imágenes locales e imágenes de repositorios remotos (repositorios privados de organizaciones de las que formas parte en Hub). Dependiendo del tipo de imagen que selecciones, puedes extraer la imagen por etiqueta, ver la documentación, ir a Docker Hub para obtener más detalles o ejecutar un nuevo contenedor utilizando la imagen.
* Extensiones. Desde aquí, puede obtener más información sobre la extensión e instalarla con un solo clic. O, si ya tienes una extensión instalada, puedes abrirla directamente desde los resultados de la búsqueda.
* Volúmenes. Desde aquí puedes ver el contenedor asociado.
* Documentación. Encuentra ayuda en la documentación oficial de Docker directamente desde Docker Desktop.

## Menú Docker

Docker Desktop también proporciona un icono en la barra de notificaciones, que nos permite acceder a varias funcionalidades:
* Panel de control. Esto le lleva al Docker Dashboard.
* Iniciar sesión/Registrarse
* Configuración
* Buscar actualizaciones
* Solución de problemas
* Dar feedback
* Cambiar a contenedores Windows (si estás en Windows)
* Acerca de Docker Desktop. Contiene información sobre las versiones que está ejecutando y enlaces al Contrato de Servicio de Suscripción, por ejemplo.
* Docker Hub
* Documentación
* Extensiones
* Kubernetes
* Reiniciar
* Salir de Docker Desktop



---

# Gestión de volúmenes en Docker Desktop

## Listado de volúmenes

En la vista de volúmenes podemos acceder a la lista de volúmenes disponible. Además del nombre del volumen, tenemos información del estado (si está en uso o disponible), el tiempo desde su creación y su tamaño. Además podemos eliminar un volumen que no este en uso.

Si pulsamos sobre el nombre de un volumen accederemos a una pantalla donde podremos visualizar los ficheros que hay almacenados en el volumen y el contenedor que lo está usando.

![volumen](img/volumen1.png)

## Creación de volúmenes

Tenemos la opción de crear nuevos volúmenes indicando si nombre:

![volumen](img/volumen2.png)