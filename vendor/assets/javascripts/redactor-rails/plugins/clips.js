(function($) {
  $.Redactor.prototype.clips = function() {
    return {
      init: function() {
        var items = [],
              templates = undefined;
        if (this.opts.template_type == 'summary' && REDACTOR.params.clips.summary) {
          templates = REDACTOR.params.clips.summary;
        } else if (this.opts.template_type == 'detail' && REDACTOR.params.clips.detail) {
          templates = REDACTOR.params.clips.detail;
        }
        if (templates !== undefined && templates.length > 0) {
          items = templates;
        }

        this.clips.template = $('<ul id="redactor-modal-list">');

        if (items.length > 0) {
          for (var i = 0; i < items.length; i++) {
            var li = $('<li>');
            var a = $('<a href="#" class="redactor-clip-link">').text(items[i][0]);
            var div = $('<div class="redactor-clip">').hide().html(items[i][1]);

            li.append(a);
            li.append(div);
            this.clips.template.append(li);
          }
        } else {
          var li = $('<li>'),
                span = $('<span>');
          span.text(this.lang.get('clip_no_template'));
          li.append(span)
          this.clips.template.append(li);
        }
        modal_body = this.utils.getOuterHtml(this.clips.template);

        if (items.length > 0) {
          modal_body += "<input type='checkbox' class='remove_all' style='margin-top: 10px'>" + this.lang.get('remove_all');
        }
        this.modal.addTemplate('clips', '<section>' + modal_body + '</section>');

        var button = this.button.addBefore('fullscreen', 'clips', this.lang.get('clip_label'));
        this.button.addCallback(button, this.clips.show);

      },
      show: function() {
        this.modal.load('clips', this.lang.get('clip_insert'), 400);

        this.modal.createCancelButton();

        $('#redactor-modal-list').find('.redactor-clip-link').each($.proxy(this.clips.load, this));

        this.selection.save();
        this.modal.show();
      },
      load: function(i,s) {
        $(s).on('click', $.proxy(function(e) {
          e.preventDefault();
          this.clips.insert($(s).next().html());

        }, this));
      },
      insert: function(html) {
        var remove_all = $("#redactor-modal-body .remove_all").is(':checked');
        this.selection.restore();
        if (remove_all) {
          this.insert.set(html);
        } else {
          this.insert.html(html);
        }
        this.modal.close();
        this.observe.load();
      }
    };
  };
})(jQuery);

