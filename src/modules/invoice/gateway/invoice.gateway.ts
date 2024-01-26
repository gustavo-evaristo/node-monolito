import Invoice from "../domain/entity/invoice.entity";

export default interface InvoiceGateway {
  add(invpice: Invoice): Promise<void>;
  find(id: string): Promise<Invoice>;
}
