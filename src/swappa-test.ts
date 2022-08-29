import { BigInt, ethereum} from "@graphprotocol/graph-ts"
import { SWAPPA_TEST, Swap } from "../generated/SWAPPA_TEST/SWAPPA_TEST"
import {  DailyVolume, MonthlyVolume,  YearlyVolume, SwapEntity, Tenant } from "../generated/schema"
import {ONE, SECONDS_IN_DAY, ZERO} from "./constants";
import {toBigInt} from "./utils";
import { BigDecimal } from '@graphprotocol/graph-ts'
// import {createClient} from 'urql';
import { log } from '@graphprotocol/graph-ts'


export function handleSwap(event: Swap): void {

  log.info('HELOOOOOO LOG!!!!!! {}', ["hello again"])

  // VOLUME AND FEE FROM SWAP API 
  const total_volume = event.params.inputAmount
  const fee = toBigInt(25);

  var old_total_volume = toBigInt(0);

// SWAP ENTITY 
  let swapentity = SwapEntity.load(event.transaction.from.toHex())
  if (!swapentity)
  {
    swapentity = new SwapEntity(event.transaction.from.toHex())
    swapentity.id = (event.params.date).toString()
    swapentity.sender = (event.params.sender).toHexString()
    swapentity.to = (event.params.to).toHexString()
    swapentity.input =  (event.params.input).toHexString()
    swapentity.output = (event.params.output).toHexString()
    swapentity.inputAmount =  event.params.inputAmount
    swapentity.outputAmount =  event.params.outputAmount
    swapentity.tenantId =  event.params.partnerId
    swapentity.date = event.params.date
  }
  swapentity.save()

  // DATE CONVERSIONS 
  let unixEpoch: BigInt =  event.params.date //event.block.timestamp;
  let daysSinceEpochStart = unixEpoch / SECONDS_IN_DAY;
  daysSinceEpochStart = daysSinceEpochStart + toBigInt(719468);
  let era: BigInt = (daysSinceEpochStart >= ZERO ? daysSinceEpochStart : daysSinceEpochStart - toBigInt(146096)) / toBigInt(146097);
  let dayOfEra: BigInt = (daysSinceEpochStart - era * toBigInt(146097));          // [0, 146096]
  let yearOfEra: BigInt = (dayOfEra - dayOfEra/toBigInt(1460) + dayOfEra/toBigInt(36524) - dayOfEra/toBigInt(146096)) / toBigInt(365);  // [0, 399]
  let year: BigInt = yearOfEra + (era * toBigInt(400));
  let dayOfYear: BigInt = dayOfEra - (toBigInt(365)*yearOfEra + yearOfEra/toBigInt(4) - yearOfEra/toBigInt(100));                // [0, 365]
  let monthZeroIndexed = (toBigInt(5)*dayOfYear + toBigInt(2))/toBigInt(153);                                   // [0, 11]
  let day = dayOfYear - (toBigInt(153)*monthZeroIndexed+toBigInt(2))/toBigInt(5) + toBigInt(1);                             // [1, 31]
  let month = monthZeroIndexed + (monthZeroIndexed < toBigInt(10) ? toBigInt(3) : toBigInt(-9));                            // [1, 12]
  year = month <= toBigInt(2) ? year + ONE : year;


  // TENANT ENTITY 
  let tenant_entity = Tenant.load(event.transaction.from.toHex())
  if (!tenant_entity)
  {
    tenant_entity = new Tenant(event.transaction.from.toHex())
  } 

  tenant_entity.id = (event.params.partnerId).toString()
  tenant_entity.totalVolumeUSD = total_volume
  tenant_entity.fee  = fee
  tenant_entity.save()

  // DAILY ENTITY
  let daily_entity = DailyVolume.load(event.transaction.from.toHex())
  if (!daily_entity)
  {
    daily_entity = new DailyVolume(event.transaction.from.toHex())
  }
  else{
    old_total_volume = daily_entity.totalVolumeUSD
  }
  daily_entity.id = (event.params.partnerId).toString() + "-" + (day).toString() 
  daily_entity.timestamp = (event.params.date).toString()
  const new_total_volume = old_total_volume.plus(total_volume)
  daily_entity.totalVolumeUSD = new_total_volume
  daily_entity.save()


// MONTHLY ENTITY
  let monthly_entity = MonthlyVolume.load(event.transaction.from.toHex())
  if (!monthly_entity)
  {
    monthly_entity = new MonthlyVolume(event.transaction.from.toHex())
  }
  monthly_entity.id = (event.params.partnerId).toString() + "-" + (month).toString() 
  monthly_entity.timestamp = (event.params.date).toString()
  monthly_entity.totalVolumeUSD = total_volume
  monthly_entity.save()

  // YEARLY ENTITY 
  let yearly_entity = YearlyVolume.load(event.transaction.from.toHex())
  if (!yearly_entity)
  {
    yearly_entity = new YearlyVolume(event.transaction.from.toHex())
  }
  yearly_entity.id = (event.params.partnerId).toString() + "-" + (year).toString() 
  yearly_entity.timestamp = (event.params.date).toString()
  yearly_entity.totalVolumeUSD = total_volume
  yearly_entity.save()

}













