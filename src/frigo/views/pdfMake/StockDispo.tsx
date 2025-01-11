import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import dayjs from 'dayjs';
import EntreeR1Dispo from 'src/frigo/logic/models/EntreeR1Dispo';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const formatDate = (dateString:string) => {
    return dayjs(dateString).format('DD/MM/YYYY');
};

export const generatePdfDispo = (data: EntreeR1Dispo[], fileName: string) => {
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;

  const tableBody = [
    [
        { text: 'PRODUIT', style: 'tableHeader' },
        { text: 'CATEGORIE', style: 'tableHeader' },
        { text: 'PRIX DE VENTE', style: 'tableHeader' },
        { text: 'QTE DISPO', style: 'tableHeader' },
        { text: 'STOCK MINIM', style: 'tableHeader' }
    ],
    ...data.map(row => [
        row.produit + ' ' + row.mesure,
        { text: row.categorie, alignment: 'center' },
        { text: row.pv, alignment: 'center' },
        { text: row.st_dispo, alignment: 'center' },
        { text: row.stockMinimal, alignment: 'center' }
    ])
  ];

  const documentDefinition: any = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: `Situation - Liste des produits du stock disponibles - ${formattedDate}`,
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

