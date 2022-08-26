import { BigInt, ethereum} from "@graphprotocol/graph-ts"
import { SWAPPA_TEST, Swap } from "../generated/SWAPPA_TEST/SWAPPA_TEST"
import { ExampleEntity, SwapEntity, Tenant } from "../generated/schema"
import {ONE, SECONDS_IN_DAY, ZERO} from "./constants";
import {toBigInt} from "./utils";

export function handleSwap(event: Swap): void {
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


  let unixEpoch: BigInt =  event.params.date //event.block.timestamp;

  // you can have leap seconds apparently - but this is good enough for us ;)
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


  const total_volume = new BigInt(10);
  const fee = new BigInt(25);

  let tenant_entity = Tenant.load(event.transaction.from.toHex())
  if (!tenant_entity)
  {
    tenant_entity = new Tenant(event.transaction.from.toHex())
  } 

  tenant_entity.id = (event.params.partnerId).toString()
  tenant_entity.totalVolumeUSD = total_volume
  tenant_entity.fee  = fee
  // tenant_entity.hourly_volume = 
  // tenant_entity.daily_volume  = 
  // tenant_entity.weekly_volume = 
  // tenant_entity.monthly_volume  = 
  tenant_entity.save()


  






}













