import { User } from "./user.entity";
import { Ticket } from "./ticket.entity";
import { RefreshToken } from "./refresh-token.entity";
import { Category } from "./category.entity";
import { TicketMessage } from "./ticket-message.entity";
import { Feedback } from "./feedback.entity";
import { Fungsi } from "./fungsi.entity";
import { Responses } from "./responses.entity";

const entities = { User, Ticket, RefreshToken, Category, TicketMessage, Feedback, Fungsi, Responses };

export { User, Ticket, RefreshToken, Category, TicketMessage, Feedback, Fungsi, Responses };
export default entities