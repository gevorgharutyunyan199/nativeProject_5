import {AsYouType, isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js'
import {apiProdUrl, apiUrl} from "../assets/constants";
import moment from 'moment';

class _ValidationService {

    countries = ['US'];

    validate(numbers){
        let valid = true;

        if(typeof numbers === 'string'){
            for(let i = 0; i < this.countries.length; i++){
                valid = isValidPhoneNumber(`${numbers}`, this.countries[i]) === true;
                if(!valid){
                    return valid
                }
            }
        }else {
            for(let j = 0; j < numbers.length; j++){
                for(let i = 0; i < this.countries.length; i++){
                    valid = isValidPhoneNumber(`${numbers[j]}`, this.countries[i]) === true;
                    if(!valid){
                        return valid
                    }
                }
            }
        }
        return valid
    }

    parsePhoneNumber(number){
        try{
            let parsedNumber = parsePhoneNumber(number, 'US');
            return parsedNumber.formatNational()
        }catch{
            return number
        }
    }

    phoneNumberValidationSignIn(number){
        let valid = {
            ok: true,
            error: '',
            number: number
        };

        let isValidUSNumber = isValidPhoneNumber(`${number}`, 'US');

        if(isValidUSNumber){
            try{
                let phoneNumberUS = parsePhoneNumber(number, 'US');
                if(phoneNumberUS.country !== 'US'){
                    valid = {
                        ok: false,
                        error: 'Not supported country.',
                        number: number
                    };
                }else {
                    valid = {
                        ok: true,
                        error: '',
                        number: phoneNumberUS.number
                    };
                }
            }catch{
                valid = {
                    ok: false,
                    error: '',
                    number: number
                }
            }
        }else {
            valid = {
                ok: false,
                error: 'Please provide your 10-digit phone number.',
                number: number
            };
        }

        if(!valid.ok && apiUrl !== apiProdUrl){
            let isValidAMNumber = isValidPhoneNumber(`${number}`, 'AM');
            if(isValidAMNumber){
                let phoneNumberAM = parsePhoneNumber(number, 'AM');
                if(phoneNumberAM.country === 'AM'){
                    valid = {
                        ok: true,
                        error: '',
                        number: phoneNumberAM.number
                    };
                }
            }
        }

        return valid
    }

    formatePhoneNumber = (phoneNumber) => {
        phoneNumber = phoneNumber.trim();
        const asYouType = new AsYouType('US');
        asYouType.input(phoneNumber);
        return asYouType.getNumber().number.replace('+', '')
    };

    convertDateDivider = (date)=>{
        date = new Date(date);
        const formatDate = 'YYYY-MM-DD';
        const getDay = (date) => {
            if (date)
                return moment(date).format(formatDate);
            else
                return moment().format(formatDate)
        };
        const today = moment(getDay(), formatDate).startOf('day');
        const oldDate = moment(getDay(date), formatDate);
        if (today.diff(oldDate, 'day') < 1) {
            return 'Today'
        } else if (today.diff(oldDate, 'day') < 2) {
            return 'Yesterday'
        } else if (today.diff(oldDate, 'day') < 3) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 4) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 5) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 6) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 7) {
            return oldDate.format('dddd');
        } else {
            return oldDate.format('ll')
        }
    };
}

const ValidationService = new _ValidationService();

export default ValidationService;
