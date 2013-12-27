jQuery(function($){

    // The variable jcrop_api will hold a reference to the
    // Jcrop API once Jcrop is instantiated.
    var jcrop_api;
    var 
        boundx,
        boundy,

        $preview = $('#preview-pane'),
        $pcnt = $('#preview-pane .preview-container'),
        $pimg = $('#preview-pane .preview-container img'),

        xsize =250|| $pcnt.width(),//set Img Preview size
        ysize =170|| $pcnt.height();
        
    initJcrop();
    
    function initJcrop()
    {
      // Hide any interface elements that require Jcrop
      // (This is for the local user interface portion.)
      $('.requiresjcrop').hide();

      // Invoke Jcrop in typical fashion
      $('#target').Jcrop({
        onChange: updatePreview,
        onSelect: updatePreview,
        onRelease: releaseCheck
      },function(){

          var bounds = this.getBounds();
          boundx = bounds[0];
          boundy = bounds[1];

        jcrop_api = this;
        jcrop_api.animateTo([100,100,400,300]);

        $('#can_click,#can_move,#can_size').attr('checked','checked');
        $('#ar_lock,#size_lock,#bg_swap').attr('checked',false);
        $('.requiresjcrop').show();
        $preview.appendTo(jcrop_api.ui.holder);
      });

    };

    function updatePreview(c)
    {
      //$pimg.attr('src',$('#target').attr('src'));
      if (parseInt(c.w) > 0)
      {
        var rx = xsize / c.w;
        var ry = ysize / c.h;
        var bounds = jcrop_api.getBounds();
        boundx = bounds[0];
        boundy = bounds[1];
        var width =  Math.round(rx * boundx) + 'px';
        var height = Math.round(ry * boundy) + 'px'; 
        console.log('width:'+width+ ' height:'+height);
        $pimg.css({
          width:width ,
          height: height,
          marginLeft: '-' + Math.round(rx * c.x) + 'px',
          marginTop: '-' + Math.round(ry * c.y) + 'px'
        });
      }
    };
    function changePreview(obj,url){
       $(obj).attr('src',url); 

    }

    // Use the API to find cropping dimensions
    // Then generate a random selection
    // This function is used by setSelect and animateTo buttons
    // Mainly for demonstration purposes
    function getRandom() {
      var dim = jcrop_api.getBounds();
      return [
        Math.round(Math.random() * dim[0]),
        Math.round(Math.random() * dim[1]),
        Math.round(Math.random() * dim[0]),
        Math.round(Math.random() * dim[1])
      ];
    };

    // This function is bound to the onRelease handler...
    // In certain circumstances (such as if you set minSize
    // and aspectRatio together), you can inadvertently lose
    // the selection. This callback re-enables creating selections
    // in such a case. Although the need to do this is based on a
    // buggy behavior, it's recommended that you in some way trap
    // the onRelease callback if you use allowSelect: false
    function releaseCheck()
    {
      jcrop_api.setOptions({ allowSelect: true });
      $('#can_click').attr('checked',false);
    };

    // Attach interface buttons
    // This may appear to be a lot of code but it's simple stuff
    $('#setSelect').click(function(e) {
      // Sets a random selection
      jcrop_api.setSelect(getRandom());
    });
    $('#animateTo').click(function(e) {
      // Animates to a random selection
      jcrop_api.animateTo(getRandom());
    });
    $('#release').click(function(e) {
      // Release method clears the selection
      jcrop_api.release();
    });
    $('#disable').click(function(e) {
      // Disable Jcrop instance
      jcrop_api.disable();
      // Update the interface to reflect disabled state
      $('#enable').show();
      $('.requiresjcrop').hide();
    });
    $('#enable').click(function(e) {
      // Re-enable Jcrop instance
      jcrop_api.enable();
      // Update the interface to reflect enabled state
      $('#enable').hide();
      $('.requiresjcrop').show();
    });
    $('#rehook').click(function(e) {
      // This button is visible when Jcrop has been destroyed
      // It performs the re-attachment and updates the UI
      $('#rehook,#enable').hide();
      initJcrop();
      $('#unhook,.requiresjcrop').show();
      return false;
    });
    $('#unhook').click(function(e) {
      // Destroy Jcrop widget, restore original state
      jcrop_api.destroy();
      // Update the interface to reflect un-attached state
      $('#unhook,#enable,.requiresjcrop').hide();
      $('#rehook').show();
      return false;
    });

    // Hook up the three image-swapping buttons
    $('#img1').click(function(e) {
      $(this).addClass('active').closest('.btn-group')
        .find('button.active').not(this).removeClass('active');

      jcrop_api.setImage('image/sago.jpg');
      jcrop_api.setOptions({ bgOpacity: .6 });
      return false;
    });
    
    $('#img2').click(function(e) {
      $(this).addClass('active').closest('.btn-group')
        .find('button.active').not(this).removeClass('active');

      jcrop_api.setImage('image/pool.jpg');
      jcrop_api.setOptions({ bgOpacity: .6 });
      var url = 'image/pool.jpg';
      changePreview($pimg,url);   
      return false;
    });
    $('#img3').click(function(e) {
      $(this).addClass('active').closest('.btn-group')
        .find('button.active').not(this).removeClass('active');

      jcrop_api.setImage('image/sago.jpg',function(){
        this.setOptions({
          bgOpacity: 1,
          outerImage: 'image/sagomod.jpg'
        });
        this.animateTo(getRandom());
      });
      return false;
    });

    // The checkboxes simply set options based on it's checked value
    // Options are changed by passing a new options object

    // Also, to prevent strange behavior, they are initially checked
    // This matches the default initial state of Jcrop

    $('#can_click').change(function(e) {
      jcrop_api.setOptions({ allowSelect: !!this.checked });
      jcrop_api.focus();
    });
    $('#can_move').change(function(e) {
      jcrop_api.setOptions({ allowMove: !!this.checked });
      jcrop_api.focus();
    });
    $('#can_size').change(function(e) {
      jcrop_api.setOptions({ allowResize: !!this.checked });
      jcrop_api.focus();
    });
    $('#ar_lock').change(function(e) {
      jcrop_api.setOptions(this.checked?
        { aspectRatio: 4/3 }: { aspectRatio: 0 });
      jcrop_api.focus();
    });
    $('#size_lock').change(function(e) {
      jcrop_api.setOptions(this.checked? {
        minSize: [ 80, 80 ],
        maxSize: [ 350, 350 ]
      }: {
        minSize: [ 0, 0 ],
        maxSize: [ 0, 0 ]
      });
      jcrop_api.focus();
    });

    function readImgURL(input,callback) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                //$('#target').attr('src', e.target.result);
                callback && callback(e)
            }

            reader.readAsDataURL(input.files[0]);
        }
    }  
    $('#upload_button').on('click',function(){
        $('#upload').trigger('click')
        
    });
    $('#upload').on('change',function(ee){
        var val = $(this).val();
        var uploadImg= val.split('\\');
        var uploadImgName = uploadImg[uploadImg.length-1].split('.')[0];
        $(this).data('uploadImgName',uploadImgName)
        readImgURL(this,function(ee){
            debugger
           // jcrop_api && jcrop_api.destroy();
            //$('#target').attr('src',ee.target.result) 
            //initJcrop()     
            var url = ee.target.result;
            jcrop_api.setImage(url);
            changePreview($pimg,url);
        })

    })
    $('#draw_button').on('click',function(){
        var oTarget =$('.jcrop-holder :first-child :first-child')[0]; 
        drawImage($pcnt,function(data){
            var dataBlob = dataURItoBlob(data)
            var uploadImgName = $('#upload').data('uploadImgName');
            uploadFormData(uploadImgName,dataBlob)
            debugger
        });
    });
    function uploadFormData(name,dataBlob){
        var fd = new FormData();
        fd.append('fname', name);
        fd.append('data', dataBlob);
        $.ajax({
            type: 'POST',
            url: 'localhost:3000/upload',
            data: fd,
            processData: false,
            contentType: false
        }).done(function(data) {
               console.log(data);
        }).fail(function(err){
            debugger
        });
    }
    function drawImage(obj,callback){
        //var oTarget =$('.jcrop-holder :first-child')[0]; 
        html2canvas(obj,{
            onrendered:function(canvas){
              // $('canvas').remove()
              // document.body.appendChild(canvas)
              // toDataURL(type,quality);
                var imgData = canvas.toDataURL('image/png');
                var v = 0,test;
                callback && callback(imgData);
              // for(var i = 0; i < 100; i++ ){

              //     v += 0.01;
              //     x = parseFloat((v).toFixed(2))
              //     var testData =canvas.toDataURL('image/jpeg', x);

              //     if(testData == imgData){
              //         console.log('The default value is: ' + x);
              //     }else{
              //         console.log('v:'+v+'\n x'+x);
              //     }
              // } 
            }
        })
    }
    function dataURItoBlob(dataURI) {//base64 to blob
      var type = /data:([\w]+\/[\w]+);base64/.exec(dataURI)[1];
      var binary = atob(dataURI.split(',')[1]), array = [];
        for(var i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
        return new Blob([new Uint8Array(array)], {type: type});
    }

  });

