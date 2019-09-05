const download = require('download-git-repo');

exports.gitClone = async (templateType, name) => {
    return new Promise((resolve, rejects) => {
        download(`direct:https://github.com/tjubao/tus-${templateType}.git`, name, { clone: true }, function (err) {
            err ? rejects('') : resolve('');
        })
    });
}

exports.resetGit = () => {

}