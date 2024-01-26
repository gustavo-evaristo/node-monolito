import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const address = new Address(
      input.street,
      input.number,
      input.complement,
      input.city,
      input.state,
      input.zipCode
    );

    const items = input.items.map(
      (item) =>
        new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        })
    );

    const invoice = new Invoice({
      name: input.name,
      address,
      document: input.document,
      items,
    });

    await this._invoiceRepository.create(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      city: invoice.address.city,
      state: invoice.address.state,
      complement: invoice.address.complement,
      number: invoice.address.number,
      street: invoice.address.street,
      zipCode: invoice.address.zipCode,
      total: invoice.items.reduce((acc, item) => acc + item.price, 0),
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
    };
  }
}
