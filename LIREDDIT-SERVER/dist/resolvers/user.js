"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("../entities/User");
let usernameAndPasswordInput = class usernameAndPasswordInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], usernameAndPasswordInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], usernameAndPasswordInput.prototype, "password", void 0);
usernameAndPasswordInput = __decorate([
    (0, type_graphql_1.InputType)()
], usernameAndPasswordInput);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    async me({ em, req }) {
        if (!req.session.userId) {
            return null;
        }
        const user = await em.findOne(User_1.User, { _id: req.session.userId });
        console.log(req.session);
        return user;
    }
    async register(options, { em, req }) {
        if (options.username.length < 2) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Username length is too short.",
                    },
                ],
            };
        }
        if (options.password.length <= 4) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Password length should be greater than 4.",
                    },
                ],
            };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const user = em.create(User_1.User, {
            username: options.username,
            password: hashedPassword,
        });
        try {
            await em.persistAndFlush(user);
        }
        catch (error) {
            if (error.code === "23505" ||
                error.detail.includes() === "already exists") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username is already taken",
                        },
                    ],
                };
            }
        }
        req.session.userId = user._id;
        return { user };
    }
    async login(options, { em, req }) {
        const user = await em.findOne(User_1.User, { username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "username does not exist!",
                    },
                ],
            };
        }
        const validUser = await argon2_1.default.verify(user.password, options.password);
        if (!validUser) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password",
                    },
                ],
            };
        }
        req.session.userId = user._id;
        return { user };
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usernameAndPasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usernameAndPasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
//# sourceMappingURL=user.js.map