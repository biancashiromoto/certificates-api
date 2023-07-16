const express = require('express');
const fs = require('fs');
const crypto = require('node:crypto');

const app = express();

app.use(express.json());

const certificatesRoute = '/certificates';
const certificatesFile = './certificates.json';

const readCertificates = () => {
  const data = fs.readFileSync(certificatesFile, 'utf8');
  return JSON.parse(data);
};

const saveCertificates = (arr) => {
  const data = JSON.stringify(arr, null, 2);
  fs.writeFileSync(certificatesFile, data, 'utf8');
};

app.get(certificatesRoute, (req, res) => {
  const certificates = readCertificates();
  res.status(200).json({ certificates });
});

app.post(certificatesRoute, (req, res) => {
  const { url, title, school } = req.body;
  const certificates = readCertificates();
  const newCertificate = {
    id: crypto.randomUUID(),
    url,
    title,
    school,
  };
  certificates.push(newCertificate);
  saveCertificates(certificates);

  res.status(201).json({ certificate: newCertificate });
});

app.put(`${certificatesRoute}/:id`, (req, res) => {
  const certificates = readCertificates();
  const { id } = req.params;
  const { name, school, url } = req.body;

  const updatedCertificate = certificates.find((certificate) => certificate.id === Number(id));
  if (!updatedCertificate) {
    return res.status(404).json({ message: 'Certificate not found' });
  }

  updatedCertificate.name = name;
  updatedCertificate.school = school;
  updatedCertificate.url = url;

  saveCertificates(certificates);

  res.status(200).json({ updatedCertificate });
});

app.delete(`${certificatesRoute}/:id`, (req, res) => {
  const certificates = readCertificates();
  const { id } = req.params;
  const position = certificates.findIndex((certificate) => certificate.id === Number(id));
  certificates.splice(position, 1);
  saveCertificates(certificates);

  res.status(200).end();
});
module.exports = app;