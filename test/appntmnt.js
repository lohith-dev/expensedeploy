let chai = require("chai");
let server = require("../app.js");
let chaiHttp = require("chai-http");

chai.should();

chai.use(chaiHttp);

describe('Appointment Api',()=>{
    describe('GET /appointmentData',()=>{
        it("It should Get all the Appointments",(done)=>{
            chai.request(server)
            .get("/appointmentData")
            .end((err,response)=>{
                response.should.have.status(200);
                response.should.be.a('Object');
                done();
            })
        
        })

        it("It should NOT Get all the Appointments",(done)=>{
            chai.request(server)
            .get("/appointmentDat")
            .end((err,response)=>{
                response.should.have.status(404);
                done(); 
            })
       
        })
    })

 // get appointment Data by id

    describe('GET /appointmentData/:id',()=>{
        it("It should Get single Appointment",(done)=>{
            const taskId=2;
            chai.request(server)
            .get(`/appointmentData/${taskId}`)
            .end((err,response)=>{
                response.should.have.status(200);
                response.body.should.be.a('Object');
                response.body.should.have.property('id');
                response.body.should.have.property('email');
                response.body.should.have.property('name');
                response.body.should.have.property('phone');

                done();
            })
        
        })


        it("It should NOT Get Appointment",(done)=>{
            const taskId=123;
            chai.request(server)
            .get(`/appointmentData/${taskId}`)
            .end((err,response)=>{
                response.should.have.status(404);
                response.text.should.be.eq("The appointement data with provided ID does not exist!")
                done();
            })
        
        })

       
    })

 // Post appointment Data
describe('POST /appointmentData/:id',()=>{
        it("It should POST a new Appointment",(done)=>{
            const appt={
                name:"praveen",
                email:"praveen123@gmail.com",
                phone:"8197617047"
            }
            chai.request(server)
            .post(`/appointmentData`)
            .send(appt)
            .end((err,response)=>{
                response.should.have.status(201);
                response.body.should.be.a('Object');
                response.body.should.have.property('data');
                const data = response.body.data;
                data.should.be.an('object');
                data.should.have.property('id');
                data.should.have.property('email');
                data.should.have.property('name');
                data.should.have.property('phone');
                done();
            })
        
        })


        // it("It should NOT Get Appointment",(done)=>{
        //     const taskId=123;
        //     chai.request(server)
        //     .get(`/appointmentData/${taskId}`)
        //     .end((err,response)=>{
        //         response.should.have.status(404);
        //         response.text.should.be.eq("The appointement data with provided ID does not exist!")
        //         done();
        //     })
        
        // })

       
    })

})
