import { Parser } from 'json2csv';

export function participantsToCSV(rows) {
  const parser = new Parser({ fields: ['name', 'email', 'phone', 'college', 'yearDept', 'createdAt'] });
  return parser.parse(rows.map((r) => ({
    name: r.name,
    email: r.email,
    phone: r.phone || '',
    college: r.college || '',
    yearDept: r.yearDept || '',
    createdAt: r.createdAt?.toISOString() || '',
  })));
}
