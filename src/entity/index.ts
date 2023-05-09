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

const entities = {
    User, Ticket, RefreshToken, Category, TicketMessage, Feedback, Fungsi, Responses, Product, Configuration, TimeSchedule,
    Faq, FungsiSchedule
};

export {
    User, Ticket, RefreshToken, Category, TicketMessage, Feedback, Fungsi, Responses, Product, Configuration, TimeSchedule,
    Faq, FungsiSchedule
};
export default entities