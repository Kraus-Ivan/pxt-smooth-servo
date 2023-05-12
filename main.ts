// knihovna.ts
namespace smoothServo {

    export class SmoothServo {
        private pin: AnalogPin;

        private target: number;
        private current: number;
        private zasobnik: number[] = [];

        private min: number = 400;
        private max: number = 2600;

        constructor(pin: AnalogPin) {
            this.pin = pin;
            this.target = 0;
            this.current = 1550;
            pins.servoSetPulse(this.pin, this.current);
        }

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

    // vytvoří nový SmoothServo
    export function createServo(pin: AnalogPin): SmoothServo {
        return new SmoothServo(pin);
    }
}
