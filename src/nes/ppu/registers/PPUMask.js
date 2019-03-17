import { InMemoryRegister } from "../../registers";

/**
 * PPU Mask Register (> write)
 *
 * Controls the rendering of sprites and backgrounds, as well as colour effects.
 */
export default class PPUMask extends InMemoryRegister {
	constructor() {
		super(0x2001);

		this.addField("grayscale", 0)
			.addField("showBackgroundInLeftmost8PixelsOfScreen", 1)
			.addField("showSpritesInLeftmost8PixelsOfScreen", 2)
			.addField("showBackground", 3)
			.addField("showSprites", 4)
			.addField("emphasizeRed", 5)
			.addField("emphasizeGreen", 6)
			.addField("emphasizeBlue", 7);
	}
}