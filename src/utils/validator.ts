import { Request, Response } from 'express';
import httpstatus from './httpstatus';
import Validator from 'validatorjs';

class ValidatorUtil {
    validate(
        req: Request, 
        res: Response, 
        rules: Validator.Rules
    ): boolean {
        const validation = new Validator(req.body, rules);
        
        if (validation.fails()) {
            httpstatus.invalidInputResponse(validation.errors.all(), res);
            return true; // Indicates validation failed
        }
        
        return false; // Indicates validation passed
    }
}

export default new ValidatorUtil();