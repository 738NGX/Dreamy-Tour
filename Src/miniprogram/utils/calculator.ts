export function evaluateExpression(expression: string): string {
    const sanitizedExpression = expression.replace(/\s+/g, '');

    if (!isValidExpression(sanitizedExpression)) {
        return "算式输入错误";
    }

    try {
        const result = calculate(sanitizedExpression);

        if (isNaN(result)) {
            return "算式输入错误";
        }

        return result.toString();
    } 
    catch (error) {
        return "算式输入错误";
    }
}

function isValidExpression(expression: string): boolean {
    const validChars = /^[0-9+\-×÷().]+$/;

    if (!validChars.test(expression)) {
        return false;
    }

    const stack: string[] = [];
    for (const char of expression) {
        if (char === '(') {
            stack.push(char);
        } 
        else if (char === ')') {
            if (stack.length === 0) {
                return false;
            }
            stack.pop();
        }
    }

    if (stack.length !== 0) {
        return false;
    }

    if (/([+\-×÷]{2,})/.test(expression) || /[+\-×÷]{1}\)/.test(expression) || /\([+\-×÷]/.test(expression)) {
        return false;
    }

    return true;
}

function calculate(expression: string): number {
    const normalizedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');

    const operators: { [key: string]: number } = { '+': 1, '-': 1, '*': 2, '/': 2 };

    const values: number[] = [];
    const ops: string[] = [];

    let i = 0;
    while (i < normalizedExpression.length) {
        const char = normalizedExpression[i];

        if (/\d/.test(char)) {
            let buffer = '';
            while (i < normalizedExpression.length && /\d|\./.test(normalizedExpression[i])) {
                buffer += normalizedExpression[i];
                i++;
            }
            values.push(parseFloat(buffer));
        } 
        else if (char === '(') {
            ops.push(char);
            i++;
        } 
        else if (char === ')') {
            while (ops.length > 0 && ops[ops.length - 1] !== '(') {
                values.push(applyOp(ops.pop()!, values.pop()!, values.pop()!));
            }
            ops.pop();
            i++;
        } 
        else if (operators[char]) {
            while (ops.length > 0 && precedence(ops[ops.length - 1], char, operators)) {
                values.push(applyOp(ops.pop()!, values.pop()!, values.pop()!));
            }
            ops.push(char);
            i++;
        } 
        else {
            i++;
        }
    }

    while (ops.length > 0) {
        values.push(applyOp(ops.pop()!, values.pop()!, values.pop()!));
    }

    return values.pop()!;
}

function precedence(op1: string, op2: string, operators: { [key: string]: number }): boolean {
    return operators[op1] >= operators[op2];
}

function applyOp(op: string, b: number, a: number): number {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        default: throw new Error("不支持的操作符");
    }
}