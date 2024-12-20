import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import dayjs from 'dayjs';
import Mouvement from 'src/frigo/logic/models/Mouvement';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const formatDate = (dateString:string) => {
    return dayjs(dateString).format('DD/MM/YYYY');
};

export const generatePdf = (data: Mouvement[], fileName: string, dd: string, df:string) => {
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;

  const tableBody = [
    [
        { text: 'N°', style: 'tableHeader' },
        { text: 'PRODUIT', style: 'tableHeader' },
        { text: 'STOCK INIT', style: 'tableHeader' },
        { text: 'QTE ENTREE', style: 'tableHeader' },
        { text: 'QTE SORTIE', style: 'tableHeader' },
        { text: 'STOCK DISPO', style: 'tableHeader' },
        { text: 'STOCK MINI', style: 'tableHeader' }
    ],
    ...data.map(row => [
        row.id,
        row.produit + ' ' + row.mesure + ' ' + row.categorie,
        { text: row.st_init, alignment: 'center' },
        { text: row.qt_e, alignment: 'center' },
        { text: row.qt_s, alignment: 'center' },
        { text: row.st_dispo, alignment: 'center' },
        { text: row.stockMinimal, alignment: 'center' }
    ])
  ];

  const documentDefinition: any = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: `Situation - Liste des produits du stock du ${dd} au ${df}`,
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
          widths: ['auto', 'auto', '*', '*', '*', '*', 'auto'],
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

