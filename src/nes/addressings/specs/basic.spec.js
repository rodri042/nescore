import addressings from "..";
import getValue from "../_getValue";
import createTestContext from "../../helpers/createTestContext";
import { Byte } from "../../helpers";
import _ from "lodash";
const should = require("chai").Should();

describe("addressings", () => {
	let cpu, memory, context;

	beforeEach(() => {
		({ cpu, memory, context } = createTestContext());
		cpu.cycles = 2;
	});

	it("getValue method", () => {
		memory.writeAt(0xfe9d, 123);
		const addressingMock = { getAddress: () => 0xfe9d, getValue };
		addressingMock.getValue(context).should.equal(123);
	});

	describe("immediate", () => {
		it("returns the same value", () => {
			(() => addressings.IMMEDIATE.getAddress(context, 120)).should.throw(
				"The IMMEDIATE addressing mode only supports the `getValue` method"
			);
			addressings.IMMEDIATE.getValue(context, 120).should.equal(120);
		});
	});

	describe("absolute", () => {
		it("returns the same address", () => {
			addressings.ABSOLUTE.getAddress(context, 0xfe8d).should.equal(0xfe8d);
		});
	});

	describe("zeroPage", () => {
		it("returns the same address", () => {
			addressings.ZERO_PAGE.getAddress(context, 120).should.equal(120);
		});
	});

	describe("indirect", () => {
		it("dereferences the address", () => {
			memory.writeAt(130, 0x12);
			memory.writeAt(131, 0xfe);
			addressings.INDIRECT.getAddress(context, 130).should.equal(0xfe12);
		});
	});

	describe("relative", () => {
		it("returns an address based on the current pc + offset", () => {
			cpu.pc.value = 0xfe10;
			addressings.RELATIVE.getAddress(context, 4).should.equal(0xfe14);
			addressings.RELATIVE.getAddress(
				context,
				Byte.toSignedByte(-10)
			).should.equal(0xfe06);
		});

		describe("when the operation can take extra cycles", () => {
			it("adds two cycles if a page-crossed event occurs", () => {
				cpu.pc.value = 0xfafe;
				addressings.RELATIVE.getAddress(context, 20, true);
				cpu.cycles.should.equal(4);
			});

			it("doesnt add any cycles if no page-crossed event occurs", () => {
				cpu.pc.value = 0xfe10;
				addressings.RELATIVE.getAddress(context, 4, true);
				cpu.cycles.should.equal(2);
			});
		});
	});

	describe("accumulator", () => {
		it("returns the A register", () => {
			(() => addressings.ACCUMULATOR.getValue(context, 120)).should.throw(
				"The ACCUMULATOR addressing mode only supports the `getAddress` method"
			);
			cpu.registers.a.value = 135;
			addressings.ACCUMULATOR.getAddress(context).value.should.equal(135);
		});
	});
});
