import { CeramicClient } from "@ceramicnetwork/http-client";
import { DID  } from 'dids'; 
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import {fromString} from 'uint8arrays';
import modelAliases from './model.json' assert {type: 'json'};


const key = fromString(process.env.DID_KEY, "base16"); 

const did = new DID({ 
    provider:  new Ed25519Provider(key),
    resolver: getResolver(), 

});

await did.authenticate(); 

const ceramic = new CeramicClient("http://0.0.0.0:7007");
ceramic.did = did; 

const model = new DataModel({ ceramic, model: modelAliases}); 
const store = new DIDDataStore({ceramic, model}); 

const person1 = { 
    name: "Patrick doe",
    age: 53,
    friends: [{ name: "Jane Doe", age:26}],
}; 

const newNote = await model.createTile("Person", person1); 

console.log(newNote.content);



