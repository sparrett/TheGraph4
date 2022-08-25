import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { Swap } from "../generated/SWAPPA_TEST/SWAPPA_TEST"

export function createSwapEvent(
  sender: Address,
  to: Address,
  input: Address,
  output: Address,
  inputAmount: BigInt,
  outputAmount: BigInt,
  partnerId: BigInt,
  date: BigInt
): Swap {
  let swapEvent = changetype<Swap>(newMockEvent())

  swapEvent.parameters = new Array()

  swapEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  swapEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  swapEvent.parameters.push(
    new ethereum.EventParam("input", ethereum.Value.fromAddress(input))
  )
  swapEvent.parameters.push(
    new ethereum.EventParam("output", ethereum.Value.fromAddress(output))
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "inputAmount",
      ethereum.Value.fromUnsignedBigInt(inputAmount)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "outputAmount",
      ethereum.Value.fromUnsignedBigInt(outputAmount)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "partnerId",
      ethereum.Value.fromUnsignedBigInt(partnerId)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam("date", ethereum.Value.fromUnsignedBigInt(date))
  )

  return swapEvent
}
