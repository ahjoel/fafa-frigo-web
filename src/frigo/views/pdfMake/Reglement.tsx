import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import dayjs from 'dayjs';
import Reglement from 'src/frigo/logic/models/Reglement';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const formatDate = (dateString:string) => {
    return dayjs(dateString).format('DD/MM/YYYY');
};

export const generatePdfReglement = (data: Reglement[], fileName: string) => {
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;

  const tableBody = [
    [
        { text: 'DATE REGLEMENT', style: 'tableHeader' },
        { text: 'CLIENT', style: 'tableHeader' },
        { text: 'CODE FACTURE', style: 'tableHeader' },
        { text: 'TOTAL FACTURE', style: 'tableHeader' },
        { text: 'MONTANT RECU', style: 'tableHeader' },
        { text: 'RELIQUAT', style: 'tableHeader' },
        { text: 'AUTEUR', style: 'tableHeader' }
    ],
    ...data.map(row => [
        { text: row.createdAt.slice(0, -5).replace(/T/g, " "), alignment: 'center' },
        { text: row.client, alignment: 'center' },
        { text: row.codeFacture, alignment: 'center' },
        { text: row.totalFacture, alignment: 'center' },
        { text: row.mtrecu, alignment: 'center' },
        { text: row.relicat, alignment: 'center' },
        { text: row.firstname + ' ' + row.lastname, alignment: 'center' }
    ])
  ];

  const documentDefinition: any = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: `Situation - Liste des reglements du stock - ${formattedDate}`,
      alignment: 'center',
      margin: [0, 20, 0, 20],
      fontSize: 15,
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => {
      return {
        text: `Page ${currentPage} sur ${pageCount}`,
        alignment: 'center',
        margin: [0, 20, 0, 20]
      };
    },
    content: [
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', '*', '*', '*', 'auto'],
          body: tableBody
        },
        layout: {
          fillColor: function (rowIndex: number) {
            return rowIndex % 2 === 0 ? '#F3F3F3' : null;
          }
        }
      }
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'black',
        fillColor: '#A7B4F5',
        alignment: 'center',
        margin: [0, 10]
      },
      tableCell: {
        margin: [0, 2, 0, 2]
      }
    }
  };

  pdfMake.createPdf(documentDefinition).download(`${fileName}-${formattedDate}-${formattedTime}.pdf`);
};

