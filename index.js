const publicIp = require('public-ip');
const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});
const fs = require('fs');

const settings = require('./settings.json');

publicIp.v4().then((ip) => {
    if (ip === settings.publicIp) {
        console.log("Your public IP hasn't changed yet.");
        return;
    }
    // If public ip is changed from previous...
    nightmare
        .goto('https://www.onamae.com/domain/navi/dns_manage') // -> Login page
        .insert('input.lgnnm', settings.username)
        .insert('input.psswd', settings.password)
        .click('input.lgnbtn') // -> DNS control page
        .wait('form#dnscontrollForm')
        .evaluate((domain) => {
            const rows = document.querySelector('div#domaininput_view > table > tbody').children;
            Array.from(rows).forEach((element, index, array) =>  {
                if (index === 0) return;
                const label = document.querySelector(`label[for=domain_${index-1}]`);
                if (label.innerText === domain) {
                    document.getElementById(`domain_${index-1}`).checked = true;
                    return
                }
            });
        }, settings.domain)
        .click('a.idSubmitexternal') // -> DNS management page
        .wait('form#dns_manage_select_form')
        .click('a.dns_controll_input') // -> DNS-record setting page
        .wait('form#dns_controll_inputForm')
        .evaluate((subdomains, ip) => {
            const rows = document.querySelector('table#totalRecordUsed > tbody').children;
            Array.from(rows).forEach((element, index, array) => {
                if (index === 0) return;
                const hostname = document.getElementById(`hostNameUsed${index-1}`).value;
                if (subdomains.indexOf(hostname) >= 0) {
                    for (let i = 0; i < 4; i++) {
                        document.getElementById(`add_recvalue_used_A${i+1}${index-1}`).value = ip[i];
                    }
                }
            });
        }, settings.subdomains, ip.split('.'))
        .click('a.btn07#idSubmit') // -> Confirm page
        .wait('form#dnsconfirmForm')
        .click('a.btn07') // -> Done page
        .end()
        .then(() => {
            console.log(`Your public IP address has changed from previous ${settings.publicIp} to ${ip}.`)
            console.log('This change has just been reflected in お名前.com.');
            settings.publicIp = ip; // Cache to settings.json
            fs.writeFile('settings.json', JSON.stringify(settings, null, 4), (err) => {
                console.log('Modified the change to settings.json.');
            });
        })
        .catch((err) => {
            console.error(`Error: ${err}`);
        });
});
