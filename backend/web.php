<?php 

/**
* RequestErrorException
*/
class RequestErrorException extends Exception
{
    public function __construct($message, $code = 404)
    {
        parent::__construct($message, $code);
    }
    
    public function __toString()
    {
        $string = "<html>
                       <head>
                            <title>Error: {$this->code}</title>
                       </head>
                       <body>
                            <h1>Error: {$this->code}</h1>
                            <hr>
                            <p>{$this->message}</p>
                       </body>
                    </html>";
         return $string;
    }
    
    public function viewError()
    {
        Web::httpHeader($this->code);
        echo $this;
    }
    
    public function errorCode()
    {
        return $this->code;
    }
        
}

/**
* web loader
*/

class Web
{   
    private $baseURLPath        = '/xreditor/backend';
    private $urls               = null;
    private $request_url        = null;
    private $params             = null;
    private $debug              = false;
    private $debug_messages     = array();
    static protected $plugins   = array();
    
    public function __construct($baseURLPath = null)
    {                                
        if (!is_null($baseURLPath)) {   
            $this->baseURLPath = $baseURLPath;
        }                    
    } 
    
    /**
     * call a registered plugin
     * it uses call_user_func_array which can be slow
     * over many iterations 
     *
     * @param string $method 
     * @param string $args 
     * @return void
     * @author Kenrick Buchanan
     */
    
    public function __call($method, $args)
    {
        if (in_array($method, self::$plugins)) {
            array_unshift($args, $this);
            return call_user_func_array($method, $args);
        }
    }   
    
    /**
     * register a plugin to call via __call
     * first argument passed to function is an
     * instance of web.
     *
     * @param string $func 
     * @return void
     * @author Kenrick Buchanan
     */
    
    public static function registerPlugin($func)
    {
        self::$plugins[] = $func;
    }
                    
    /**
     * return baseURLPath
     * @param string baseURLPath
     * @return string baseURLPath
     * @author Kenrick Buchanan
     */

    function baseURL($baseURLPath=null)
    {                                 
        if (!is_null($baseURLPath)) {
            $this->baseURLPath = $baseURLPath;
        }
        return $this->baseURLPath;
    }                              
    
    /**
     * turn on/off debugging. output is printed to screen
     *
     * @param string $onoff 
     * @return void
     * @author Kenrick Buchanan
     */
    
    public function debug($onoff = null)    
    {                                  
        if (!is_null($onoff)) {
            $this->debug = $onoff;
        } else {
            return $this->debug;
        }        
    }
    
    /**
     * save debug messages to var for displaying later.
     *
     * @param string $msg 
     * @return void
     * @author Kenrick Buchanan
     */
    
    public function debugMsg($msg)
    {
        $this->debug_messages[] = $msg;
    }
    
    /**
     * display debug messages
     *
     * @return void
     * @author Kenrick Buchanan
     */
    
    public function debugDisplay()
    {
        if (!$this->debug_messages || !is_array($this->debug_messages)) {
            return;
        }          
        
        echo "<h2>Debug Messages</h2>\n<ol>";
        foreach ($this->debug_messages as $msg) {
            printf("<li>%s</li>", $msg);
        }                                  
        echo "</ol>";
    }
        
    
    /**
     * create instance of Web object. Only use this method
     * to get an instance of Web.
     *
     * @author Kenrick Buchanan
     */
    
    public static function &instance()
    {
        static $instance;
        if (!is_object($instance)) {             
            $instance = new Web();
        }
        return $instance; 
    }
    
    /**
     * requestUri
     *           
     * inspects $_SERVER['REQUEST_URI'] and returns a sanitized 
     * path without a leading slash (makes patterns more fun)
     * @return void
     * @author Kenrick Buchanan
     */
    
    private function requestUri()
    {
        // have seen apache set either or.
        $uri = isset($_SERVER['REDIRECT_URL']) ? $_SERVER['REDIRECT_URL'] 
                                               : $_SERVER['REQUEST_URI'];
        
        // display URL
        $this->debugMsg("URI is: ".htmlspecialchars($uri));
        
        // kill query string off REQUEST_URI
        if ( strpos($uri,'?') !== false ) {
               $uri = substr($uri,0,strpos($uri,'?'));
        }                                      
        
        // ok knock off the baseURLPath
        if (strlen($this->baseURLPath) > 1) {
            $this->debugMsg("baseURLPath is: {$this->baseURLPath}");
            $uri = str_replace($this->baseURLPath, '', $uri);        
        }                              
        
        // strip off first slash
        if(strpos($uri,'/') !== false && strpos($uri,'/') == 0) {
            $uri = substr($uri, 1);
        }
        
        $this->request_uri = htmlspecialchars($uri);        
    }
    
    /**
     * send 303 by default so browser won't cache the 200 or 301 headers
     *
     * @param string $location 
     * @param string $status 
     * @return void
     * @author Kenrick Buchanan
     */
    
    public function redirect($location, $status=303)
    {   
        self::httpHeader($status);
        header("Location: $location");
    }
    
    /**
     * send header code to browser
     *
     * @param string $code 
     * @return void
     * @author Kenrick Buchanan
     */
    
    public function httpHeader($code)
    {
        $http = array (
               100 => "HTTP/1.1 100 Continue",
               101 => "HTTP/1.1 101 Switching Protocols",
               200 => "HTTP/1.1 200 OK",
               201 => "HTTP/1.1 201 Created",
               202 => "HTTP/1.1 202 Accepted",
               203 => "HTTP/1.1 203 Non-Authoritative Information",
               204 => "HTTP/1.1 204 No Content",
               205 => "HTTP/1.1 205 Reset Content",
               206 => "HTTP/1.1 206 Partial Content",
               300 => "HTTP/1.1 300 Multiple Choices",
               301 => "HTTP/1.1 301 Moved Permanently",
               302 => "HTTP/1.1 302 Found",
               303 => "HTTP/1.1 303 See Other",
               304 => "HTTP/1.1 304 Not Modified",
               305 => "HTTP/1.1 305 Use Proxy",
               307 => "HTTP/1.1 307 Temporary Redirect",
               400 => "HTTP/1.1 400 Bad Request",
               401 => "HTTP/1.1 401 Unauthorized",
               402 => "HTTP/1.1 402 Payment Required",
               403 => "HTTP/1.1 403 Forbidden",
               404 => "HTTP/1.1 404 Not Found",
               405 => "HTTP/1.1 405 Method Not Allowed",
               406 => "HTTP/1.1 406 Not Acceptable",
               407 => "HTTP/1.1 407 Proxy Authentication Required",
               408 => "HTTP/1.1 408 Request Time-out",
               409 => "HTTP/1.1 409 Conflict",
               410 => "HTTP/1.1 410 Gone",
               411 => "HTTP/1.1 411 Length Required",
               412 => "HTTP/1.1 412 Precondition Failed",
               413 => "HTTP/1.1 413 Request Entity Too Large",
               414 => "HTTP/1.1 414 Request-URI Too Large",
               415 => "HTTP/1.1 415 Unsupported Media Type",
               416 => "HTTP/1.1 416 Requested range not satisfiable",
               417 => "HTTP/1.1 417 Expectation Failed",
               500 => "HTTP/1.1 500 Internal Server Error",
               501 => "HTTP/1.1 501 Not Implemented",
               502 => "HTTP/1.1 502 Bad Gateway",
               503 => "HTTP/1.1 503 Service Unavailable",
               504 => "HTTP/1.1 504 Gateway Time-out"       
           );
        header($http[$code]);
    }
    
    
    /**
     * inspect urls, find matched class and then run requested method
     *
     * @param string $array 
     * @param string $baseURLPath 
     * @return void
     * @author Kenrick Buchanan
     */
    
    public static function run(array $urls, $baseURLPath = null)
    {
        if (empty($urls)) {
            throw new Exception("You must pass an array of valid urls to web::run()");
            return;
        }                
        
        // get instance of Web 
        $instance = self::instance();
        $instance->baseUrl($baseURLPath);             
        
        // process the request uri
        $instance->requestUri();
        
        // debug
        $instance->debugMsg('START URL matching');
        
        $found = false;
        foreach ($urls as $url_path => $class_to_load) {
            $instance->debugMsg(htmlentities($url_path).' : '.$instance->request_uri.'<br>');
            if (preg_match($url_path, $instance->request_uri, $matches)) {
                $found = true;
                $web_class = $class_to_load;
                $instance->params = $matches;
                $instance->debugMsg("Matched URL: $url_path<br>");                
                break;
            }
        }
        
        // if there is no uri match, throw a 404 error.
        if (!$found) {            
            throw new RequestErrorException("Page not found.", 404); 
            return;
        }                                              
        
        // ok now try to find the class instantiate and load it
        if (!class_exists($class_to_load)) {                         
            throw new RequestErrorException("Class not loaded.", 500);
            return;
        }
        
        $instance->debugMsg("Loading Class: <b>$class_to_load</b>");
        
        // instantiate class
        $loaded_class = new $class_to_load();
        
        $instance->debugMsg('Checking for preRun method');
        
        // see if class has any pre-run hooks
        if (method_exists($loaded_class, 'preRun')) {
            $instance->debugMsg('Calling for preRun method');
            $retval = $loaded_class->preRun();
           
            // if pre-run hook returns false, stop processing.
            if($retval === false) {
                return;
            } 
        }
        
        // check REQUEST_METHOD
        if (!method_exists($loaded_class, $_SERVER['REQUEST_METHOD'])) {
            throw new RequestErrorException("HTTP Method not supported.", 405);
            return;
        }        
        
        $method = $_SERVER['REQUEST_METHOD'];
        
        $instance->debugMsg("About to run method: $method");
        
        // just verify method for now.
        if (!in_array($method, array('GET', 'POST', 'PUT', 'DELETE'))) {
            throw new RequestErrorException("HTTP Method not supported.", 405);
            return;
        }
        
        // ajax hook
        if ($instance->is_ajax_request()) {
            $method = "AJAX";
        }
        
        // run request
        $loaded_class->$method($instance->params);        
                
        $instance->debugMsg('Checking for postRun method');
        
        // see if class has any post-run hooks
        if (method_exists($loaded_class, 'postRun')) {
            $instance->debugMsg('Calling postRun method');
            $retval = $loaded_class->postRun();
           
            // if post-run hook returns false, stop processing.
            if($retval === false) {
                return;
            } 
        }       
    }
    
    
    /**
     * inspect headers to see if request is of ajax variety
     *
     * @return void
     * @author Kenrick Buchanan
     */
    
    private function is_ajax_request()
	{
	    return ( isset($_SERVER['HTTP_X_REQUESTED_WITH']) 
	             && $_SERVER['HTTP_X_REQUESTED_WITH']  == 'XMLHttpRequest');       
	}   
    
    /**
     * send a request to a url and get back the response
     * useful for background requests 
     * dependent upon allow_url_fopen being turned on
     * http://us3.php.net/manual/en/filesystem.configuration.php#ini.allow-url-fopen
     * if allow_url_fopen is off, it will try curl
     *
     * @param string $url 
     * @param array $data 
     * @param string $method http method
     * @param array $optional_headers 
     * @return string $response
     * @throws RequestErrorException 400 on bad request
     * @author Kenrick Buchanan
     */
    
    public function request($url, array $data=null, $method='POST', array $optional_headers=null)
    {   
        Web::instance()->debugMsg('Sending a request via fopen to: '.$url);
        if (!$on = ini_get('allow_url_fopen')) {
            return self::curlRequest($url, $data, $method, $optional_headers);
        }
        $params = array('http'    => array(
                        'method'  => $method,
                        'content' => $data
                        ));
        if ($optional_headers !== null) {
            $params['http']['header'] = $optional_headers;
        }
        $ctx = stream_context_create($params);
        $fp = fopen($url, 'rb', false, $ctx);
        if (!$fp) {
            throw new RequestErrorException("Problem with $url, $php_errormsg", 400);
        }
        $response = stream_get_contents($fp);
        if ($response === false) {
            throw new RequestErrorException("Problem reading data from $url, $php_errormsg", 400);
        }
        return $response;
    }
    
    /**
     * request a url via curl instead of fopen if allow_url_fopen is off
     * takes the same parameters as request, the is called by self::request()
     * if allow_url_fopen is off.
     *
     * @param string $url 
     * @param array $data
     * @param string $method 
     * @param string $optional_headers 
     * @return string $response
     * @throws RequestErrorException
     * @author Kenrick Buchanan
     */
    
    function curlRequest($url, array $data=null, $method='POST', array $optional_headers=null)
    {              
        Web::instance()->debugMsg('Sending a request via CURL to: '.$url);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        if (!is_null($optional_headers)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $optional_headers);
        } 
        
        // check method
        if ($method == 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            curl_setopt($ch, CURLOPT_URL, $url);
        } else {                                     
            if (!empty($data)) {
                $url .= '?'.http_build_query($data);
            }
            curl_setopt($ch, CURLOPT_URL, $url);
        }
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        if ($response === false) {
            throw new RequestErrorException("$url not reachable", 400);
        }
        return $response;
    }
    
    /**
     * returns a reference to an Inspekt Get cage object
     * to cleanly access your $_GET vars
     *                         
     * @return reference inspekt object
     * @author Kenrick Buchanan
     */
    
    public function &get()
    {
        require_once 'lib/Inspekt/Inspekt.php';
        $input = Inspekt::makeGetCage();
        return $input;
    }                                 
    
    /**
     * returns a reference to an Inspekt Post cage object
     * to cleanly access your $_POST vars
     *
     * @author Kenrick Buchanan
     */
    
    public function &post()
    {
        require_once 'lib/Inspekt/Inspekt.php';
        $input = Inspekt::makePostCage();
        return $input;
    } 
    
    /**
     * returns a reference to an Inspekt Cookie cage object
     * to cleanly access your $_COOKIE vars
     *
     * @author Kenrick Buchanan
     */
    
    public function &cookie()
    {
        require_once 'lib/Inspekt/Inspekt.php';
        $input = Inspekt::makeCookieCage();
        return $input;
    }
    
    
    /**
     * returns a reference to an Inspekt Server cage object
     * to cleanly access your $_SERVER vars
     *
     * @author Kenrick Buchanan
     */
    
    public function &server()
    {
        require_once 'lib/Inspekt/Inspekt.php';
        $input = Inspekt::makeServerCage();
        return $input; 
        
    }                             
    
    
    /**
     * returns a reference to an Inspekt Files cage object
     * to cleanly access your $_FILES vars
     *
     * @author Kenrick Buchanan
     */
    
    public function &files()
    {
        require_once 'lib/Inspekt/Inspekt.php';
        $input = Inspekt::makeFilesCage();
        return $input;
    }
    
    
    /**
     * returns a reference to an Inspekt Environment cage object
     * to cleanly access your $_ENV vars
     *
     * @author Kenrick Buchanan
     */
    
    public function &env()
    {
        require_once 'lib/Inspekt/Inspekt.php';
        $input = Inspekt::makeEnvCage();
        return $input;
    }
        
}


