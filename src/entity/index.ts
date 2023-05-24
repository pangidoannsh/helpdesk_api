import { User } from "./user.entity";
import { Ticket } from "./ticket.entity";
import { RefreshToken } from "./refresh-token.entity";
import { Category } from "./category.entity";
import { TicketMessage } from "./ticket-message.entity";
import { Feedback } from "./feedback.entity";
import { Fungsi } from "./fungsi.entity";
import { Responses } from "./responses.entity";
import { Product } from "./product.entity";
import { Configuration } from "./configuration.entity";
import { TimeSchedule } from "./time-schedule.entity";
import { Faq } from "./faq.entity";
import { FungsiSchedule } from "./fungsi-schedule.entity";
import { TicketHistory } from "./ticket-history.entity";
import { TicketAssignment } from "./ticket-assignment.entity";

const entities = {
    User, Ticket, RefreshToken, Category, TicketMessage, Feedback, Fungsi, Responses, Product, Configuration, TimeSchedule,
    Faq, FungsiSchedule, TicketHistory, TicketAssignment
};

export {
    User, Ticket, RefreshToken, Category, TicketMessage, Feedback, Fungsi, Responses, Product, Configuration, TimeSchedule,
    Faq, FungsiSchedule, TicketHistory, TicketAssignment
};
export default entities