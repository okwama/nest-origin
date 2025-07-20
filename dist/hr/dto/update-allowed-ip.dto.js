"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAllowedIpDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_allowed_ip_dto_1 = require("./create-allowed-ip.dto");
class UpdateAllowedIpDto extends (0, mapped_types_1.PartialType)(create_allowed_ip_dto_1.CreateAllowedIpDto) {
}
exports.UpdateAllowedIpDto = UpdateAllowedIpDto;
//# sourceMappingURL=update-allowed-ip.dto.js.map