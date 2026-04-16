# Módulo 01: Introducción a Docker

**Fuente:** Curso Docker 2024 - [[|Módulo 1
**Autor:** José Domingo González López
**URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo1
**URL GitHub:** https://github.com/josedom24/curso_docker_ow

---


---

# Introducción a los contenedores

Según la Wikipedia: *La virtualización utiliza el software para imitar las características del hardware y crear un sistema informático virtual*.

Esto nos permite ejecutar más de un sistema virtual, y múltiples sistemas operativos y aplicaciones, en un solo servidor, aumentando el rendimiento del hardware disponible e incrementando el tiempo de procesamiento de un equipo, ya que habitualmente se desaprovecha gran parte.

## ¿Para qué se utiliza la virtualización?

* Aislamiento e independencia de servicios y contenidos.
* Laboratorio de pruebas.
* Virtualización de arquitecturas de las que no se dispone.
* Creación de clúster de máquinas y sistemas distribuidos.
* Herramienta de aprendizajes

## Ventajas e inconvenientes de la virtualización

Las principales ventajas que podemos indicar serían:

* Importante ahorro económico.
* Seguridad.
* Mayor aprovechamiento de recursos.
* Migración en vivo. 
* Importante ahorro energético.

Como desventajas podríamos señalar:

* Muchos sistemas dependen de un solo equipo físico.
* Penalizaciones en rendimiento.

## Tipos de virtualización

* **Emulación**: El sistema de virtualización imita o suplanta vía software una arquitectura al completo (procesador, memoria, conjunto de instrucciones, comunicaciones...). Ejemplo: QEMU, Microsoft Virtual PC, Wine, ...
* **Virtualización por hardware de tipo 1**: Simula un hardware suficiente para permitir que un sistema operativo no adaptado se ejecute de forma aislada. Controla directamente el hardware físico del host ofreciéndolo directamente a la máquina virtual. Ejemplos: Xen, Kernel-based Virtual Machine (KVM), Microsoft Hyper-V, VMware ESXi,...
* **Virtualización completa de tipo 2**: En este caso este software no controla directamente el hardware físico, por lo que el rendimiento puede ser menor que el anterior. Ejemplos: VMware Workstation, Parallels Desktop, VirtualBox, VMware Player, ...
* **Virtualización ligera**: O también llamada **virtualización a nivel de sistema operativo**, o **virtualización basada en contenedores**. Es un método de virtualización en el que, sobre el núcleo del sistema operativo se ejecuta una capa de virtualización que permite que existan múltiples instancias aisladas de espacios de usuario. A cada espacio de usuario aislado lo llamamos **contenedor**.

## Contenedores

Un contenedor es un conjunto de procesos aislados, que se ejecutan en un servidor, y que acceden a un sistema de ficheros propio, tienen una configuración de red propia y acceden a los recursos del host (memoria y CPU). Utilizan para su funcionamiento el núcleo del host donde se ejecutan.

Podemos hacer la siguiente clasificación de contenedores:

* **Contenedores de Sistemas**: El uso que se hace de ellos es muy similar al que hacemos sobre una máquina virtual: se accede a ellos (normalmente por ssh), se instalan servicios, se actualizan, ejecutan un conjunto de procesos, ... Ejemplo: LXC(Linux Container).
* **Contenedores de Aplicación**: Se suelen usar para el despliegue de aplicaciones web. Ejemplo: Docker, Podman, ...

## Contenedores y aplicaciones

¿Qué aplicaciones web son más idóneas para desplegar en contenedores?

* Si tenemos aplicaciones monolíticas, vamos a usar un esquema multicapa, es decir cada servicio (servicio web, servicio de base de datos, ... ) se va a desplegar en un contenedor.
* Realmente, las aplicaciones que mejor se ajustan al despliegue en contenedores son la desarrolladas con microservicios:
    * Cada componente de la aplicación (“microservicio”) se puede desplegar en un contenedor.
    * Comunicación vía HTTP API REST y colas de mensajes.
    * Facilita enormemente las actualizaciones de versiones de cada componente.
    * ...

## Ventajas del uso de contenedores de aplicaciones

1. **Portabilidad**: Los contenedores encapsulan una aplicación y todas sus dependencias de manera aislada. Esto facilita la portabilidad, ya que los contenedores pueden ejecutarse de manera consistente en diferentes entornos, como desarrollo, pruebas y producción.
2. **Aislamiento**: Los contenedores proporcionan un nivel de aislamiento entre la aplicación y el sistema operativo del anfitrión. Esto asegura que las aplicaciones se ejecuten sin interferencias con otras aplicaciones o componentes del sistema, evitando conflictos de dependencias y problemas de compatibilidad.
3. **Eficiencia en el uso de recursos**: Al compartir el núcleo del sistema operativo y solo incluir las bibliotecas y dependencias necesarias, los contenedores son más eficientes en términos de recursos en comparación con las máquinas virtuales. Esto permite una utilización más efectiva de los recursos del sistema y una mayor densidad de aplicaciones por servidor.
4. **Despliegue rápido**: Los contenedores permiten la creación, el despliegue y la escalabilidad rápida de aplicaciones. La capacidad de implementar contenedores en cuestión de segundos o minutos facilita la entrega continua y el despliegue ágil de aplicaciones.

---

# Instalación de Docker Desktop en Linux

Podemos [instalar](https://docs.docker.com/desktop/install/linux-install/) **Docker Desktop** en distintas distribuciones Linux: Debian, Fedora, Ubuntu,... En este apartado vamos a realizar la instalación en la distribución [Ubuntu](https://docs.docker.com/desktop/install/ubuntu/).

Los requisitos mínimos necesarios son:

* CPU con arquitectura de 64 bits y soporte de virtualización.
* Virtualización KVM.
* Entorno gráfico Gnome, KDE o MATE.
* 4 Gb de RAM.
* A partir de Ubuntu 22.04.

1. Configuramos los repositorios de Docker:
    ```
    sudo apt-get update
    sudo apt-get install ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    
    echo \
    "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    ```

2. Descargamos el paquete deb de la página oficial de instalación:

    ![linux](img/linux1.png)

3. Instalamos Docker Desktop:

    ```
    sudo apt-get update
    sudo apt-get install ./docker-desktop-<version>-<arch>.deb
    ```

    La `<version>` y el `<arch>` dependerán de qué versión y arquitectura te hayas descargado.

4. Tendremos a nuestra disposición un icono que permite iniciar **Docker Desktop**. En este momento se iniciará la máquina virtual donde se está ejecutando el demonio Docker.

    ![linux](img/linux2.png)

    También tenemos a nuestra disposición en la máquina donde hemos instalado **Docker Desktop** el cliente Docker:

    ```bash
    $ docker version
    Client: Docker Engine - [[|Community
     Cloud integration: v1.0.35+desktop.10
     Version:           25.0.3
     ...
    Server: Docker Desktop 4.27.2 (137060)
     Engine:
      Version:          25.0.3
      ...

## Autentificación en Docker Hub desde Docker Desktop

**Docker Hub** es el registro público de imágenes Docker. De este registro vamos a descargar las imágenes que necesitemos. Si queremos subir al registro nuestras propias imágenes tendremos que [registrarnos en este servicio](https://hub.docker.com/signup).

Desde **Docker Desktop** podemos autentificarnos en **Docker Hub** con nuestra cuenta, de esta manera podremos gestionar nuestras imágenes en el registro.

En distribuciones Linux vamos a usas claves GPG para cifrar las credenciales de acceso, y estas credenciales se van almacenar usando la utilidad `pass`.

Lo primero que tenemos que hacer es inicializar un par de claves GPG (pública y privada), para ello:

```bash
$ gpg --generate-key
...
gpg: clave 09FFD80DB166C498 marcada como de confianza absoluta
gpg: creado el directorio '/home/usuario/.gnupg/openpgp-revocs.d'
gpg: certificado de revocación guardado como '/home/usuario/.gnupg/openpgp-revocs.d/B4901885C051839E8CBEA0E609FFD80DB166C498.rev'
claves pública y secreta creadas y firmadas.

pub   rsa3072 2024-02-15 [SC] [caduca: 2026-02-14]
      B4901885C051839E8CBEA0E609FFD80DB166C498
uid                      José Domingo Muñoz <josedom24@example.com>
sub   rsa3072 2024-02-15 [E] [caduca: 2026-02-14]

```

Durante la generación nos pedirá nuestro nombre y apellidos, nuestro correo electrónico y nos pedirá una "frase de paso" para asegurar el uso de la clave privada que estamos creando.

A continuación inicializaremos la utilidad `pass` usando la clave pública que hemos creado, tenemos que indicar el campo `ID` de la clave pública:

```bash
$ pass init B4901885C051839E8CBEA0E609FFD80DB166C498
mkdir: se ha creado el directorio '/home/usuario/.password-store/'
Password store initialized for B4901885C051839E8CBEA0E609FFD80DB166C498
```

En el directorio `/home/usuario/.password-store/` se guardarán las credenciales cifradas de acceso a Docker Hub.

Para finalizar, desde **Docker Desktop** podemos pulsar sobre el botón **Sign In** para loguearnos en **Docker Hub**. Y podremos comprobar que estamos autentificados de forma correcta:

![linux](img/linux3.png)
---

# Instalación de Docker Desktop en Windows

Podemos [instalar](https://docs.docker.com/desktop/install/windows-install/) **Docker Desktop** en distintas versiones del sistema operativo Windows:  En este apartado vamos a realizar la instalación en windows 10 Pro (versión 22H2). En sistemas Windows **Docker Desktop** instala el demonio Docker o sobre una máquina Linux usando WSL (Subsistema de Windows para Linux) o usando una máquina virtual ejecutada sobre el hipervisor Hyper-V. Nosotros vamos a usar la primera opción de instalación.

Los requisitos mínimos necesarios son:

* CPU con arquitectura de 64 bits y soporte de virtualización en BIOS.
* WSL versión 1.1.3.0 o superior, con posibilidad de pasar a WSL 2.
* Windows 11 64-bit: Home, Pro. Enterprise o Education (versión 21H2 o superior).
* Windows 10 64-bit: Recomendado Home, Pro. Enterprise o Education (versión 22H2 build 19045 o superior), aunque se puede usar Home, Pro. Enterprise o Education (versión 21H2 build 19044 o superior).
* 4 Gb de RAM.


1. Descargamos el instalador mediante el botón de descarga de la página de instalación:

    ![windows](img/windows1.png)

2. Ejecutamos el instalador haciendo doble click en `Docker Desktop Installer.exe`. De forma predeterminada, Docker Desktop se instala en `C:\Archivos de programa\Docker\Docker`.
3. Durante la instalación elegiremos la opción **Utilizar WSL 2 en lugar de Hyper-V**. Si su sistema sólo admite una de las dos opciones, no podrá seleccionar qué backend utilizar.
4. Siga las instrucciones del asistente de instalación para autorizar al instalador y proceder con la instalación.
5. Cuando la instalación se haya realizado correctamente, seleccione **Close & restart** para completar el proceso de instalación.

Después del reinicio tendremos un icono para ejecutar **Docker Desktop**, y si queremos pulsando sobre el botón **Sign in** nos podremos autentificar con nuestra cuenta de **Docker Hub**:

![windows](img/windows2.png)

Por último, si accedemos a una terminal ejecutando PowerShell o cmd, podemos usar el cliente Docker:

![windows](img/windows3.png)

Los usuarios de Mac puedes seguir estas [instrucciones](https://docs.docker.com/desktop/install/mac-install/) para instalar **Docker Desktop** en MacOS.
---

# Introducción a Docker

## Docker

* Docker es una tecnología de virtualización "ligera" cuyo elemento básico es la utilización de contenedores en vez de máquinas virtuales y cuyo objetivo principal es el despliegue de aplicaciones encapsuladas en dichos contenedores.
* Docker es una plataforma de código abierto diseñada para facilitar la creación, implementación y ejecución de aplicaciones en entornos contenerizados.

## Docker

* "Docker": estibador.
* Pertenece a los denominados contenedores de aplicaciones
* Nuevo paradigma. Cambia completamente la forma de desplegar y distribuir una aplicación basado en el lema **build, ship and run**.
* Lo desarrolla la empresa **Docker, Inc**, pero actualmente es un proyecto perteneciente a la **Cloud Native Computing Foundation (CNCF)** con lo que se asegura el desarrollo de los estándares  que se utilizan.
* Software libre.

## Objetos Docker

* **Contenedor**: 
    * Entorno aislado donde se ejecuta una aplicación. 
    * Tiene su propio sistema de ficheros con todas las dependencias que necesita la aplicación para funcionar. 
    * Puede estar conectado a una red virtual y utilizar almacenamiento adicional para no perder la información importante.
    * Utiliza los recursos del servidor donde se está ejecutando (núcleo del sistema operativo, CPU, RAM).    
    * Los contenedores Docker suelen ejecutar un sólo proceso.
    * Los contenedores Docker son efímeros
* **Imagen**: 
    * Una imagen es una plantilla de sólo lectura con instrucciones para crear un contenedor Docker. 
    * Contiene el sistema de fichero que tendrá el contenedor. 
    * Además establece el comando que ejecutará el contenedor por defecto. 
    * Podemos crear nuestras propias imágenes o utilizar las creadas por otros y publicadas en un registro. 
    * Un contenedor es una instancia ejecutable de una imagen. 
* **Redes, Volúmenes, Plugins**

## Arquitectura de Docker

Docker utiliza una arquitectura cliente-servidor. El **cliente Docker** se comunica (usando una API REST) con el **demonio Docker**, encargado de gestionar las imágenes, contenedores, volúmenes, redes,...

![ ](img/arquitectura_docker.png)

## Arquitectura de Docker

* **El demonio Docker (Docker Engine)**: Ofrece una API REST que utiliza el cliente Docker, y gestiona los objetos Docker.
    * El ordenador donde está instalado el demonio Docker lo llamaremos **Host Docker**.
    * De forma predeterminada el demonio Docker y los contenedores que gestionan se ejecutan por el usuario administrador del sistema.
    * Podemos instalador Docker para ser usado por usuario sin privilegios (**modo rootless**), aunque tiene algunas limitaciones se consigue tener más seguridad.
* **El cliente Docker**: Usando el comando `docker` nos comunicamos con el demonio Docker para gestionar los objetos Docker con los que trabajamos. El cliente y el demonio pueden estar en equipos distintos.
* **Registros Docker**: Un registro Docker almacena imágenes Docker. **Docker Hub** es un registro público que cualquiera puede utilizar, y Docker busca imágenes en Docker Hub de forma predeterminada. Podemos instalar en nuestros servidores  registros privados.
* **Docker Desktop**: Aplicación gráfica que permite la gestión sencilla de objetos Docker. Incluye el demonio y el cliente Docker.
* **Docker Swarm**: Es la solución de orquestación de contenedores ofrecida por Docker.

## Docker en la actualidad

Podemos obtener Docker de varias formas:
* **Moby**: Proyecto de comunidad (*docker.io* de debian/ubuntu). [Más información](https://mobyproject.org/)
* **Docker CE**: Componentes de Docker proporcionado por la empresa Docker inc.
    * Para uso personal es gratuito.
    * Para uso profesional, ofrecen distintos tipos de suscripciones con diferentes precios:
        * Pro, Team, Business
        * [Más información](https://www.docker.com/pricing/)

## Instalar Docker CE

Dos opciones:

* Instalar **Docker Engine**:
    * Incluye el cliente y el demonio Docker.
    * Sólo se puede instalar en distribuciones Linux: CentOS, Debian, Fedora, Ubuntu, ...
* Instalar **Docker Desktop**:
    * Incluye el cliente y el demonio Docker.
    * El demonio Docker se ejecuta en una máquina virtual.
    * Nos ofrece una aplicación gráfica para gestionar los objetos Docker.
    * Es necesario tener entorno gráfico.
    * Incluye algunas otras funcionalidades,...
    * Se puede instalar en Linux, Windows y Mac.



## Alternativas a Docker

Otras empresas han desarrollado software de contenedores de aplicación:

* **podman**: Creado por Red Hat como alternativa a Docker. [Más información](https://podman.io).
* **containerd**: Inicialmente desarrollado por Docker, containerd es un componente fundamental en la arquitectura de Docker que ha sido separado como un proyecto independiente y es parte de la **Cloud Native Computing Foundation (CNCF)**. [Más información](https://containerd.io/).
* **CRI-O**: También desarrollado por Red Hat y parte de la CNCF, CRI-O se centra en proporcionar una implementación liviana y especializada para la ejecución de contenedores en entornos de Kubernetes. [Más información](https://cri-o.io/).
* **pouch**: Otro sistema de contenedores creado por la empresa Alibaba como alternativa a Docker. [Más información](https://pouchcontainer.io).

## Limitaciones de Docker

* Docker ha revolucionado el uso de los contenedores, para el despliegue de aplicaciones web.
* Pero Docker tiene algunas limitaciones:
    * El proceso de actualización de versiones en producción.
    * ¿Cómo se balancea la carga entre contenedores iguales?
    * ¿Cómo se conectan contenedores que se ejecutan en diferentes demonios de Docker?
    * ¿Se puede hacer una actualización de una aplicación sin interrupción?
    * ¿Se puede variar a demanda el número de réplicas de un determinado contenedor?

* Las respuestas a estas preguntas y otras similares tiene que venir del uso de un **Orquestador de Contenedores**.

## Orquestadores de contenedores

* Un Orquestador de contenedores es un programa que gestiona los contenedores que se ejecutan en un clúster de servidores. Nos ofrece muchas características:
    * Actualizaciones automáticas, balanceo de carga, tolerancia a fallos, escalabilidad, . . .

* Distintas alternativas:
    * Docker Swarm
    * Apache Mesos
    * Hashicorp Nomad
    * Kubernetes

* Hoy en día se acepta generalmente que el vencedor ha sido kubernetes. ¿Por qué?:
    * Gran cantidad de empresas implicadas en su desarrollo, iniciada por Google pero donada a la CNCF con una versión inicial muy madura, gran número de aplicaciones complementarias,. . . 
    * El resto de proyectos siguen activos, como alternativas más sencillas a k8s o en su propio nicho.


---

# Instalación de Docker Engine en Linux

## Instalación de Docker Engine

**Docker Engine** está disponible en varias distribuciones de Linux, macOS y Windows a través de Docker Desktop y como instalación binaria estática, sólo se puede instalar en distribuciones Linux.. 

En este apartado vamos a realizar la instalación binaria de Docker Engine sobre una distribución Linux Ubuntu 22.04. Puedes seguir la [documentación oficial](https://docs.docker.com/engine/install/) para aprender el método de instalación en otros sistemas.

Para el sistema operativo Ubuntu puedes seguir las instrucciones y requerimientos en el siguiente [enlace](https://docs.docker.com/engine/install/ubuntu/). Suponemos que vamos a realizar la instalación en un sistema operativo que no tiene instalado versiones antiguas de Docker.

Tenemos varios métodos de instalación disponible: instalando Docker Desktop, usando los repositorios oficiales de Docker, descargando manualmente los ficheros `deb` o ejecutando un script de instalación.

En nuestro caso usaremos los repositorios apt de de Docker, para ello:

1. Actualizamos los repositorios e instalamos los paquetes necesarios para instalar desde repositorios HTTPS:

        sudo apt-get update
        sudo apt-get install ca-certificates curl gnupg

2. Añadir la clave GPG oficial de Docker:

        sudo install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        sudo chmod a+r /etc/apt/keyrings/docker.gpg

3. Añadimos el repositorio oficial de Docker:

        echo \
        "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

4. Instalamos Docker Engine:

        sudo apt-get update
        sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

Para manejar Docker con un usuario sin privilegio, debemos añadir el usuario al grupo `docker`, para ello:

    sudo usermod -aG docker $USER

Debes volver a iniciar una terminal con el usuario, o ejecutar el siguiente comando:

    su - $USER

Y finalmente, comprobamos la versión con la que vamos a trabajar:

    docker --version
    Docker version 26.0.0, build ...

Si queremos más información de las versiones de los componentes con los que vamos a trabajar, ejecutamos:

        docker version

Para más información del sistema que hemos instalado podemos ejecutar:

        docker info
