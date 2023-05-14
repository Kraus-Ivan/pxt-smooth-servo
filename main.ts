/**
 * Tato knihovna poskytuje třídu SmoothServo, která umožňuje ovládat servo motor na mikrokontroléru micro:bit.
 */
namespace smoothServo {

    /**
     * Třída SmoothServo umožňuje ovládat servo motor pomocí plynulých pohybů.
     */
    export class SmoothServo {
        private pin: AnalogPin;

        private target: number;
        private current: number;
        private zasobnik: number[] = [];

        private min: number = 400;
        private max: number = 2600;

        /**
         * Konstruktor třídy SmoothServo.
         * @param pin Analogový vstup, ke kterému je připojen servo motor.
         */
        constructor(pin: AnalogPin) {
            this.pin = pin;
            this.target = 0;
            this.current = 1550;
            pins.servoSetPulse(this.pin, this.current);
        }

        /**
         * Pohne servo motorem na zadanou pozici.
         * @param position Pozice, na kterou se má servo motor posunout (v rozsahu od 0 do 180).
         * @param speed Rychlost pohybu motoru (v rozsahu od 1 do 100).
         */
        public moveTo(position: number, speed: number = 30) {
            this.target = position;
            let step = speed;
            if (this.target > this.current) {
                for (let i = 0; this.current + step * i < this.target; i++) {
                    this.zasobnik.push(this.current + (step * i));
                }
            } else {
                for (let i = 0; this.current - step * i > this.target; i++) {
                    this.zasobnik.push(this.current - (step * i));
                }
            }
        }

        /**
         * Aktualizuje pozici servo motoru.
         */
        public update() {
            if (this.zasobnik !== undefined && this.zasobnik.length > 0) {
                let e = this.zasobnik.shift()
                pins.servoSetPulse(this.pin, e);
                this.current = e;
            } else {
                pins.servoSetPulse(this.pin, this.current);
            }
        }
    }

    /**
     * Vytvoří nový SmoothServo objekt pro ovládání servo motoru.
     * @param pin Analogový vstup, ke kterému je připojen servo motor.
     * @returns Nový SmoothServo objekt.
     */
    export function createServo(pin: AnalogPin): SmoothServo {
        return new SmoothServo(pin);
    }
}
