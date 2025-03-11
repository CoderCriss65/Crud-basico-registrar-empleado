const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const { dir } = require("console");
const { formatMessagesSync } = require("esbuild");


const app=express();
const port=3000;

app.use(express.json());
app.use(cors());

//conexion a la base de datos;
const db=mysql.createConnection({
host:"localhost",
user:"root",
password:"123",
database:"pruebas"

});

db.connect(err=>{
    if(err){
        console.log("Error al conectarse a la base de datos");
    }else{
        console.log("conectado a la base de datos");
    }
});

// Servir archivos estáticos desde la carpeta "src"
app.use(express.static(path.join(__dirname)));

//ruta inicial para servir "index.html"
app.get("/",(request,response)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});

//Guardar todos los empleados;
app.get("/empleados",(request,response)=>{
    db.query("SELECT * FROM empleados",(error, results)=>{
        if(error){
            response.status(500).json({ error: error.message});
        }else{
            response.json(results);
        }
    });
});

//Obtener un empleado por su id;
app.get("/empleados/:id",(request,response)=>{
    const id=request.params.id;
    db.query("SELECT * FROM empleados WHERE id=?",[id],(error,results)=>{
        if(error){
            response.status(500).json({error: error.message});
        }else if(results.length===0){
            response.status(404).json({mensaje:"Empleado no encontrado"});
        }else{
            response.json(results[0]);
        }
    });
});

//agregar un empleado:
app.post("/empleados",(request,response)=>{
    const {documento, nombres, apellidos, fechanacimiento,telefono, correo,direccion,ciudad,contrato,jornada}=request.body;

    if(!documento ||
        !nombres || 
        !apellidos ||
        !fechanacimiento || 
        !telefono ||
        !correo ||
        !direccion ||
        !ciudad ||
        !contrato ||
        !jornada
    ){
        return response.status(400).json({ mensaje: "Todoso los campos son obliatorios"});
    }
    db.query(
        "INSERT INTO empleados(documento,nombres,apellidos,fechanacimiento,telefono,correo,direccion,ciudad,contrato,jornada) VALUES(?,?,?,?,?,?,?,?,?,?)",
        [documento,nombres,apellidos,fechanacimiento,telefono,correo,direccion,ciudad,contrato,jornada],
        (error,result)=>{
            if(error){
                response.status(500).json({ error: error.message});
            }else{
                response.status(201).json({ mensaje:"empleado agregado", id: result.insertId});
                console.log("Nuevo empleado registrado:");
                console.log(request.body);
            }
        });
});

// agrear emoleados de forma masiva
app.post("/empleados/masivo",(request,response)=>{
    const empleados=request.body;
    //validar si el array de empleados esta vacio
    if(!Array.isArray(empleados) || empleados.length===0){
        return response.status(400).json({ mensaje:"debe enviar un array completo de obejtos de tipo  empleados"});
    }

    const valores=empleados.map(({documento,nombres,apellidos,fechanacimiento,telefono,correo,direccion,ciudad,contrato,jornada})=>[documento,nombres,apellidos,fechanacimiento,correo,telefono,direccion,ciudad,contrato,jornada]);
    const sql="INSERT INTO empleados(documento,nombres,apellidos,fechanacimiento,telefono,correo,direccion,ciudad,contrato,jornada) VALUES ?";


    db.query(sql,[valores],(error,result)=>{
        if(error){
            response.status(500).json({ error: error.message});
        }else{
            response.status(201).json({mensaje:"empleados agregados correctamente",filasinsertadas: result.insertId});
        }
    });

});

//Actualizar un empleado a partir de su id en la base de datos;
app.put("/empleados/:id",(request,response)=>{
    const id=request.params.id;
    const {documento,nombres, apellidos,fechanacimiento,telefono,correo,direccion,ciudad,contrato,jornada}=request.body;

    if(!documento ||
        !nombres || 
        !apellidos || 
        !fechanacimiento || 
        !telefono ||
        !correo ||
        !direccion ||
        !ciudad ||
        !contrato ||
        !jornada){
        return response.status(400).json({ mensaje:"Todos los campos son obligatorios"});
    }

    db.query(
        "UPDATE empleados SET documento=?, nombres=?, apellidos=?, fechanacimiento=?, telefono=?, correo=?, direccion=?, ciudad=?, contrato=?, jornada=? WHERE id=?",
        [documento,nombres,apellidos,fechanacimiento,telefono,correo,direccion,ciudad,contrato,jornada, id],
        (error,result)=>{
            if(error){
                response.status(500).json({ error: error.message});
            }else if(result.affectedRows===0){
                response.status(404).json({ mensaje:"Empleado no encontrado"});
            }else{
                response.json({ mensaje:"Empleado actualizado correctamente"});
            }
        });
});

//Eliminar emoleado de la base de datos a partir de su id;
app.delete("/empleados/:id",(request,response)=>{
    const id=request.params.id;

    db.query(
        "DELETE FROM empleados WHERE id=?",[id],(error,result)=>{
            if(error){
                response.status(500).json({ error:error.message});
            }else if(result.affectedRows===0){
                response.status(404).json({mensaje:"Empleado no encontrado"});
            }else{
                response.json({ mensaje:"Empleado eliminado correctamente"});
            }
        });
});



// Iniciar el servidor
app.listen(3500, "0.0.0.0", () => {
    console.log("Servidor corriendo en http://0.0.0.0:3500");
});