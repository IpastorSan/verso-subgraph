import { UserProfile, Token } from "../generated/schema";

import {
    BatchMetadataUpdate as BatchMetadataUpdateEvent,
    MetadataUpdate as MetadataUpdateEvent,
    CompositionAdded as CompositionAddedEvent,
    CompositionRemoved as CompositionRemovedEvent,
    NewProfileCreated as NewProfileCreatedEvent,
    Transfer as TransferEvent
} from "../generated/ProfileRegistry/ProfileRegistry"

import {
NewVersoCollected as NewVersoCollectedEvent,
NewVersoCreated as NewVersoCreatedEvent,
OwnershipTransferred as OwnershipTransferredEvent,
TransferBatch as TransferBatchEvent,
TransferSingle as TransferSingleEvent,
URI as URIEvent
} from "../generated/MasterCollection/MasterCollection"

import { Address } from "@graphprotocol/graph-ts";

//---------------------------Registry Specific------------------------------------
export function handleNewProfileCreated(event: NewProfileCreatedEvent): void {
    let entity = new UserProfile(
      event.params.newRecordId.toString()
    )
    entity.address = event.params.account
    entity.handle = event.params.handle
    entity.uri = event.params.metadataURI
    
  
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
  
    entity.save()
  }

  export function handleTransfer(event: TransferEvent): void {
    let entity = UserProfile.load(
      event.params.tokenId.toString()
    )
    entity!.address = event.params.to
  
    entity!.blockNumber = event.block.number
    entity!.blockTimestamp = event.block.timestamp
    entity!.transactionHash = event.transaction.hash
  
    entity!.save()
  }

  export function handleCompositionAdded(event: CompositionAddedEvent): void {
    let entity = UserProfile.load(
      event.params.profileID.toString()
    )

    entity!.collections = entity?.collections ? [...entity.collections, event.params.collection.toString()] : [event.params.collection.toString()];
  
    entity!.blockNumber = event.block.number
    entity!.blockTimestamp = event.block.timestamp
    entity!.transactionHash = event.transaction.hash
  
    entity!.save()
  }
  
  export function handleCompositionRemoved(event: CompositionRemovedEvent): void {
    let entity = UserProfile.load(
      event.params.profileID.toString()
    )

    if (entity!.collections) {
      let index = event.params.index.toI32();
      if (index > -1 && index < entity!.collections.length) {
          entity!.collections.splice(index, 1);
      }
  }

    entity!.blockNumber = event.block.number
    entity!.blockTimestamp = event.block.timestamp
    entity!.transactionHash = event.transaction.hash
  
    entity!.save()
  }

  //------------------------------------Master Collection------------------------------------

  export function handleNewVersoCreated(event: NewVersoCreatedEvent): void {
    let entity = new Token(event.params.id.toString())
    
    entity.creator = event.params.account.toString()
    entity.uri = event.params.metadataURI
  
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
  
    entity.save()
  }

  export function handleNewVersoCollected(event: NewVersoCollectedEvent): void {
    let entity = Token.load(
      event.params.id.toString()
    )

    entity!.collectors = entity?.collectors ? [...entity.collectors, event.params.account.toString()] : [event.params.account.toString()];
    
  
    entity!.blockNumber = event.block.number
    entity!.blockTimestamp = event.block.timestamp
    entity!.transactionHash = event.transaction.hash
  
    entity!.save()
  }

  export function handleTransferSingle(event: TransferSingleEvent): void {
    let entity = Token.load(
      event.params.id.toString()
    )

    if (entity && event.params.to == new Address(0)) {
      if (entity.collectors && entity.collectors.includes(event.params.from.toHexString())) {
          let index = entity.collectors.indexOf(event.params.from.toHexString());
          if (index > -1) {
              entity.collectors.splice(index, 1);
          }
      }
    } else if (entity && event.params.to != new Address(0)) {
      entity.collectors = entity?.collectors ? [...entity.collectors, event.params.to.toString()] : [event.params.to.toString()];
      let index = entity.collectors.indexOf(event.params.from.toHexString());
      if (index > -1) {
          entity.collectors.splice(index, 1);
      }
    }
    
    entity!.blockNumber = event.block.number
    entity!.blockTimestamp = event.block.timestamp
    entity!.transactionHash = event.transaction.hash
  
    entity!.save()
  }
  
  export function handleTransferBatch(event: TransferBatchEvent): void {
    for (let i = 0; i < event.params.ids.length; i++) {
      let entity = Token.load(event.params.ids[i].toString())
      
      if (entity && event.params.to== new Address(0)) {
        if (entity.collectors && entity.collectors.includes(event.params.from.toHexString())) {
            let index = entity.collectors.indexOf(event.params.from.toHexString());
            if (index > -1) {
                entity.collectors.splice(index, 1);
            }
        }
      } else if (entity && event.params.to != new Address(0)) {
        entity.collectors = entity?.collectors ? [...entity.collectors, event.params.to.toHexString()] : [event.params.to.toHexString()];
        let index = entity.collectors.indexOf(event.params.from.toHexString());
        if (index > -1) {
            entity.collectors.splice(index, 1);
        }
      }
      
      entity!.blockNumber = event.block.number
      entity!.blockTimestamp = event.block.timestamp
      entity!.transactionHash = event.transaction.hash
    
      entity!.save()
    }
  }
  
  export function handleURI(event: URIEvent): void {
    let entity = Token.load(event.params.id.toString())

    entity!.uri = event.params.value
  
  
    entity!.blockNumber = event.block.number
    entity!.blockTimestamp = event.block.timestamp
    entity!.transactionHash = event.transaction.hash
  
    entity!.save()
  }