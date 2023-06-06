/**
 * Tato knihovna poskytuje třídu SmoothServo, která umožňuje ovládat servo motor na mikrokontroleru micro:bit.
 * Měla by ovládat servo plynule a netrhaně.
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
        public static servos: SmoothServo[] = [];

        /**
         * Konstruktor třídy SmoothServo.
         * Je privátní a oužíván pouze metodou createServo().
         */
        private constructor(pin: AnalogPin, min: number, max: number) {
            this.pin = pin;
            this.target = this.current = 1550;
            pins.servoSetPulse(this.pin, this.current);
            if(min < max){
                this.min = min;
                this.max = max;
            }
        }

        /**
         *
         * Statická metoda vyvářející serva, která je zároveň přidává do seznamu serv.
         * 
         */
        public static createServo(pin: AnalogPin, min: number = 400, max: number = 2600): SmoothServo {
            let v = new SmoothServo(pin, min, max);
            this.servos.push(v);
            return v;
        }

        /**
         * Naplní zásobník serva instrukcemi jak se pohnout na dannou pozici.
         * @param position Pozice, na kterou se má servo motor posunout (v rozsahu this.min až this.max)
         * @param speed Rychlost pohybu motoru (v rozsahu od 1 do 100).
         * @returns Vrací číslo 1 pokud úspěšně naplnil zásobník, číslo -1 pokud byla zadána chybné {@link position}.
         */
        public moveTo(position: number, speed: number = 30) {
            if(position < this.max && position > this.min){
                this.target = position;
                let step = speed;
                if (this.target > this.current) {
                    for (let i = 0; this.current + step * i <= this.target; i++) {
                        this.zasobnik.push(this.current + (step * i));
                    }
                } else {
                    for (let i = 0; this.current - step * i >= this.target; i++) {
                        this.zasobnik.push(this.current - (step * i));
                    }
                }
                return 1;
            }else{
                return -1;
            }

        }
         
        /**
        * Obdoba metody moveTo(), akorát zde se vybírá i odkud se servo má hýbat.
        */
        public moveToFrom(fromp: number, position: number, steps: number = 10){
             
            if(position < this.max && position > this.min){
                this.target = position;
                let step = steps;
                if (this.target > fromp) {
                    for (let i = 0; fromp + step * i <= this.target; i++) {
                        this.zasobnik.push(fromp + (step * i));
                    }
                } else {
                    for (let i = 0; fromp - step * i >= this.target; i++) {
                        this.zasobnik.push(fromp - (step * i));
                    }
                }
                return 1;
            }else{
                return -1;
            }                
                        
                        
        }

        /**
         * Aktualizuje pozice všech serv v poli this.servos. Je doporučeno volat tuto funkci ve forever loopu a to ve frekvenci maximálně 50Hz.
         */
        public static update() {
            for(let s of this.servos){
                if (s.zasobnik !== undefined && s.zasobnik.length > 0) {
                    let e = s.zasobnik.shift()
                    pins.servoSetPulse(s.pin, e);
                    s.current = e;
                } else {
                    pins.servoSetPulse(s.pin, s.current);
                }
            }
        }

        /**
         * @returns Jestli má v zásobníku hodnoty kam se dál pohnout.
         */
        public isMoving(){
            return this.zasobnik.length > 0;
        }

        /**
         * Odebírá servo se seznamu serv. Servu už nebudou posílány žádné signály.
         * @returns Zda bylo odebrání serva úspěšné.
         */
        public static removeServo(s: SmoothServo){
            return this.servos.removeElement(s);
        }

        /**
         * @returns Podrobnosti o servu v textovém řetězci.
         */
        public toString(){
            return `smoothServo.SmoothServo Servo v pinu: ${this.pin}; Min: ${this.min}; Max: ${this.max}; Aktuálně v pulsu: ${this.current}; Cíl: ${this.target}; Odebráno: ${-1===SmoothServo.servos.indexOf(this)}; Cestuje: ${this.isMoving()}`;
        }

        /**
        * @returns Hodnoty v zásobníku serva jakožto textový řetězec.
        */
        public buffer(){
            return this.zasobnik.join(",");
        }
    }
}
