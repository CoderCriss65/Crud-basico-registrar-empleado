const API_URL = "http://192.168.20.24:3500/empleados";

document.getElementById('formulario').addEventListener("submit", function(event){
    event.preventDefault();
    
    // Corregir typo en 'docuemnto' y obtener valores (.value)
    const documento = document.getElementById("documento").value;
    const nombres = document.getElementById("nombres").value;
    const apellidos = document.getElementById("apellidos").value;
    const fechanacimiento = document.getElementById("fechanacimiento").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const direccion = document.getElementById("direccion").value;
    const ciudad = document.getElementById("ciudad").value;
    const contrato = document.getElementById("contrato").value;
    const jornada = document.getElementById("jornada").value;

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            documento,
            nombres,
            apellidos,
            fechanacimiento,
            telefono,
            correo,
            direccion,
            ciudad,
            contrato,
            jornada
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(() => {
        Swal.fire({
            title: "¡Empleado registrado!",
         
            icon: "success",
            background: "#fff",
            color: "#4bb543",
            confirmButtonColor: "#6200ee",
            confirmButtonText: "¡Entendido!"
        });
        // Limpiar el formulario después del éxito (opcional)
        document.getElementById('formulario').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: "¡Error!",
            text: "No se pudo registrar el empleado.",
            icon: "error",
            background: "#1e1e1e",
            color: "white",
            confirmButtonColor: "#ff0000",
            confirmButtonText: "Intentar de nuevo"
        });
    });
});