// TODO Update for upcoming endpoints

// import app from "../../config/express";
// import request from "supertest";

describe('Placeholder test until endpoint implementation', () => {
  it('should be true', () => {
    expect(true).toBeTruthy();
  })
})

// describe("/POST to submitOrderToKafka", () => {
//   it("should return a 200", (done) => {

//     const kafka = require("../../config/kafka");
//     jest.spyOn(kafka, "ProduceBusinessMessage").mockImplementation(async () => Promise.resolve('Success'))
    
//     const data = {
//       "id": "kafka-12345",
//       "msgType": "pickupfile",
//       "data": {
//           "OrderNumber": "12345"
//       }
//     };
//     request(app)
//       .post("/submitOrderToKafka")
//       .send(data)
//       .expect(200)
//       .end(function(err: unknown) {
//         if (err) return done(err);
//         done();
//       });
//   });
// });

// describe("/POST to postPickUpFileToKafka", () => {
//   it("should return a 200", (done) => {

//     const kafka = require("../../config/kafka");
//     jest.spyOn(kafka, "ProduceBusinessMessage").mockImplementation(async () => Promise.resolve('Success'))
    
//     const order_data = {
//       "id": "kafka-12345",
//       "msgType": "pickupfile",
//       "data": {
//           "StatusCode":"PU",
//           "Weight":"0.800",
//           "VolumeWeight":"1.200",
//           "WeightQualifier":"KGM",
//           "ShipperReference":"ORD-T-4100152TDZ",
//           "AirwayBillNo":"2511188466",
//           "DeliveryDate":"2020/10/19",
//           "DeliveryTime":"12:25",
//           "PickupDate":"2020/10/19",
//           "Destination":"RUH",
//           "Origin":"DXB",
//           "NumberOfPackages": "1"
//       }
//   };
//     request(app)
//       .post("/postPickupFileToKafka")
//       .send(order_data)
//       .expect(200)
//       .end(function(err: unknown) {
//         if (err) return done(err);
//         done();
//       });
//   });
// });

// describe("/POST to postMasterMovementFileToKafka", () => {
//   it("should return a 200", (done) => {

//     const kafka = require("../../config/kafka");
//     jest.spyOn(kafka, "ProduceBusinessMessage").mockImplementation(async () => Promise.resolve('Success'))
    
//     const data = {
//       "id": "kafka-12345",
//       "msgType": "masterMovementFile",
//       "data": {
//         "payload":{
//            "items":[{
//                  "MovementDepartureDate":"2021/05/03",
//                  "MovementDepartureTime":"06:16:14",
//                  "WeightUnit":"kg",
//               },
//               {
//                  "MawbNumber":"15509111675",
//                  "HandlingUnit":[{
//                        "HandlingUnitNumber":"H964928145",
//                        "HandlingUnitType":"",
//                        "HandlingUnitRegNumber":"AAX4903DHL",
//                        "HandlingUnitParent":"H643447895",
//                        "Hawb":[{"AirwayBillNumber":"1405050032"},
//                                {"AirwayBillNumber":"2701266982"}]
//                     },
//                     {
//                        "HandlingUnitNumber":"H964928226",
//                        "HandlingUnitType":"",
//                        "HandlingUnitRegNumber":"AAX5630DHL",
//                        "HandlingUnitParent":"H643447711",
//                        "Hawb":{"AirwayBillNumber":"1405003633"}
//                 }],
//             }]
//         }
//      }
//   };
//     request(app)
//       .post("/postMasterMovementFileToKafka")
//       .send(data)
//       .expect(200)
//       .end(function(err: unknown) {
//         if (err) return done(err);
//         done();
//       });
//   });
// });

// describe("/POST to postDetailMovementFileToKafka", () => {
//   it("should return a 200", (done) => {

//     const kafka = require("../../config/kafka");
//     jest.spyOn(kafka, "ProduceBusinessMessage").mockImplementation(async () => Promise.resolve('Success'))
    
//     const data = {
//       "id": "kafka-12345",
//       "msgType": "detailMovementFile",
//       "data": {
//              "AirwayBillNumber":"1405050032",
//              "ShipmentOrigin":"DXB",
//              "ShipmentOriginCountry":"AE",
//              "ShipmentDestination":"ZYP",
//              "ShipmentWeight":"0.5",
//              "ShipmentActualWeight":"0.1",
//              "ShipmentDeclaredVolumeWeight":"0.36",
//              "ShipmentTotalVolumeMetricWeight":"0.0",
//              "Incoterm":"DAP",
//              "TotalPiecesInShipment":"1",
//              "Item":{
//                 "UnitOfMeasure":"BOX"
//              },
//              "ShipperRef":[
//                 {
//                    "ShipmentRef":"1405050032",
//                    "Qualifier":"UCI"
//                 },
//                 {
//                    "ShipmentRef":"1405050032AE20210502075244076",
//                    "Qualifier":"UCB"
//                 }
//              ],
//              "MawbNumber":"15509111675",
//              "HandlingUnitNumber":"H964928145"     
//         }
//     };

//     request(app)
//       .post("/postDetailMovementFileToKafka")
//       .send(data)
//       .expect(200)
//       .end(function(err: unknown) {
//         if (err) return done(err);
//         done();
//       });
//   });
// });

// describe("/POST to postNotificationToKafka", () => {
//   it("should return a 200", (done) => {

//     const kafka = require("../../config/kafka");
//     jest.spyOn(kafka, "ProduceNotificationMessage").mockImplementation(async () => Promise.resolve('Success'))
    
//     const data = {
//       "id": "kafka-12345",
//       "type": "PROCESSED",
//       "data": {
//              "Test-PII-Data": "TestVal"    
//         }
//     };
    
//     request(app)
//       .post("/postNotificationToKafka")
//       .send(data)
//       .expect(200)
//       .end(function(err: unknown) {
//         if (err) return done(err);
//         done();
//       });
//   });
// });