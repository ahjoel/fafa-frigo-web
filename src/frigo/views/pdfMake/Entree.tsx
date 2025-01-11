import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import dayjs from 'dayjs';
import Reglement from 'src/frigo/logic/models/Reglement';
import Entree from 'src/frigo/logic/models/Entree';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const formatDate = (dateString:string) => {
    return dayjs(dateString).format('DD/MM/YYYY');
};

export const generatePdfEntree = (data: Entree[], fileName: string) => {
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;

  const tableBody = [
    [
        { text: 'DATE CREATION', style: 'tableHeader' },
        { text: 'PRODUIT', style: 'tableHeader' },
        { text: 'CATEGORIE', style: 'tableHeader' },
        { text: 'FOURNISSEUR', style: 'tableHeader' },
        { text: 'QTE ENTREE', style: 'tableHeader' }
    ],
    ...data.map(row => [
        { text: row.createdAt.slice(0, -5).replace(/T/g, " "), alignment: 'center' },
        row.produit + ' ' + row.mesure,
        { text: row.model, alignment: 'center' },
        { text: row.fournisseur, alignment: 'center' },
        { text: row.qte, alignment: 'center' }
    ])
  ];

  const documentDefinition: any = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: `Situation - Liste des entrees du stock - ${formattedDate}`,
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
          widths: ['auto', '*', '*', '*', 'auto'],
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

