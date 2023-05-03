import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as moments from 'moment';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  mappedJson: any;

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    /****************
    * Let's make some changes in our data
    */
    this.mappedJson = json.map(item => {
      return {
        "RUC del informante": item.Contribuyente.ruc_contribuyente,
        "Razon Social del informante": item.Contribuyente.razon_social_contribuyente,
        "RUC del informado": item.Proveedor.ruc_proveedor,
        "Nombre del proveedor": item.Proveedor.nom_proveedor,
        "Fecha de emisión": item.fecha_factura_compra ? moments(item.fecha_factura_compra).format('DD-MM-YYYY') : 'N/A',
        "Condición": item.condicion_venta_compra,
        "Número de comprobante": item.nro_factura_compra,
        "Gavado 10%": item.monto_gravado_10,
        "IVA 10%": item.iva_10,
        "Gravado 5%": item.monto_gravado_5,
        "IVA 5%": item.iva_5,
        "Exento": item.exento,
        "Total comprobante": item.total_compra,
      }
    })

    /********************
    * We passed in our mappedJson after customizing it
    */
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.mappedJson);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportAsExcelFileVenta(json: any[], excelFileName: string): void {
    /****************
    * Let's make some changes in our data
    */
    this.mappedJson = json.map(item => {
      return {
        "RUC del informante": item.Contribuyente.ruc_contribuyente,
        "Razon Social del informante": item.Contribuyente.razon_social_contribuyente,
        "RUC del informado": item.Cliente.ruc_cliente,
        "Nombre del cliente": item.Cliente.razon_social_cliente,
        "Fecha de emisión": item.fecha_factura_venta ? moments(item.fecha_factura_venta).format('DD-MM-YYYY') : 'N/A',
        "Condición": item.condicion_venta_venta,
        "Número de comprobante": item.nro_factura_venta,
        "Gavado 10%": item.monto_gravado_10,
        "IVA 10%": item.iva_10,
        "Gravado 5%": item.monto_gravado_5,
        "IVA 5%": item.iva_5,
        "Exento": item.exento,
        "Total comprobante": item.total_venta,
      }
    })

    /********************
    * We passed in our mappedJson after customizing it
    */
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.mappedJson);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    /***********
    *YOUR EXCEL FILE'S NAME
    */
    FileSaver.saveAs(data, fileName + moments(Date.now()).format('DD_MM_YYYY') + EXCEL_EXTENSION);
  }

}
