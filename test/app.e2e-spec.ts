import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => { 
    await app.close(); 
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
    .get('/')
    .expect(200)
    .expect('Content-Type', /html/)
    .expect('Hello World!');
  });

  it('/contacts (GET)', () => {
    return request(app.getHttpServer())
    .get('/contacts')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect([]);
  });

  it('/contacts(POST) then /contacts/{id}(GET)', () => {
    request(app.getHttpServer())
    .post('/contacts')
    .send({
      name: { first: "Harold", middle: "Francis", last: "Gilkey"},
      address: { street: "8361 High Autumn Row", city: "Cannon", state: "Delaware", zip: "19797" },
      phone: [
        { number: "302-611-9148", type: "home" },
        { number: "302-532-9427", type: "mobile" }
      ],
      email: "harold.gilkey@yahoo.com"
    })
    .set('Accept', 'application/json')
    .then((res)=>{
      return request(app.getHttpServer())
      .get('/contacts/'+ res.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function(res){
        typeof(res.body.id) === 'number';
        res.body.email === "harold.gilkey@yahoo.com";
      })
    }).catch((e)=>{
      if(e) throw e.console.error();
    });
  });

  it('/contacts(POST) then /contacts/{id}(PUT) then /contacts/{id}(GET)', () => {
    request(app.getHttpServer())
    .post('/contacts')
    .send({
      name: { first: "Harold", middle: "Francis", last: "Gilkey"},
      address: { street: "8361 High Autumn Row", city: "Cannon", state: "Delaware", zip: "19797" },
      phone: [
        { number: "302-611-9148", type: "home" },
        { number: "302-532-9427", type: "mobile" }
      ],
      email: "harold.gilkey@yahoo.com"
    })
    .set('Accept', 'application/json')
    .then((res)=>{
      console.log(res.body.id);
      request(app.getHttpServer())
      .put('/contacts/'+ res.body.id)
      .send({email: "gilkey.harold@yahoo.com"})
      .set('Accept', 'application/json')
      return res.body.id
    })
    .then((res)=>{
      return request(app.getHttpServer())
      .get('/contacts/'+ res.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function(res){
        typeof(res.body.id) === 'number';
        res.body.email === "gilkey.harold@yahoo.com";
      })
    }).catch((e)=>{
      if(e) throw e.console.error();
    });
  });
});
