var Page = function (data) {
    if (data) {
        this.Id = data.id;
        this.Name = data.name;
        this.Picture = data.picture && data.picture.data && data.picture.data.url ? data.picture.data.url : '';
        this.Description = data.description;

        if (data.description_html) {
            data.description_html = data.description_html.replace(/<\/p>/g, 'LINEBREAKNOW').replace(/<br>/g, 'LINEBREAKNOW').replace(/<br\/>/g, 'LINEBREAKNOW').replace(/<br \/>/g, 'LINEBREAKNOW');
            data.description_html = data.description_html.replace(/<(.|\n)*?>/g, '').replace(/LINEBREAKNOW/g,'<br/>');
            this.Description = data.description_html;
        }

        this.Category = data.category;
        this.Likes = [];
    }
};

module.exports = Page;