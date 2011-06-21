<?php
/**
 * Db
 *
 * A simple wrapper for PDO. Inspired by the sweet PDO wrapper from http://www.fractalizer.ru
 *
 * @author  Anis uddin Ahmad <anisniit@gmail.com>
 * @link    http://www.fractalizer.ru/frpost_120/php-pdo-wrapping-and-making-sweet/
 * @link    http://ajaxray.com
 * @modified by ou since 2011/06/20
 */
class pdo_Db {
    protected static $_pdo = null;

    protected static $_dsn = null;
    protected static $_username = null;
    protected static $_password = null;

    protected static $_driverOptions = array();
    protected static $_fetchMode = PDO::FETCH_ASSOC;

    /**
     * Set connection information
     *
     * @example    Db::setConnectionInfo('basecamp','dbuser', 'password', 'mysql', 'http://mysql.abcd.com');
     */
    public static function setConnectionInfo($dbname, $username = null, $password = null, $database = 'mysql', $host = 'localhost')
    {
        if($database == 'mysql') {
            self::$_dsn = "mysql:dbname=$dbname;host=$host";
            self::$_username = $username;
            self::$_password = $password;
        } else if($database == 'sqlite'){
            // For sqlite, $dbname is the file path
            self::$_dsn = "sqlite:$dbname";
        }

        // Making the connection blank
        // Will connect with provided info on next query execution
        self::$_pdo = null;
    }

    /**
     * Execute a statement and returns number of effected rows
     *
     * Should be used for query which doesn't return resultset
     *
     * @param   string  $sql    SQL statement
     * @param   array   $params A single value or an array of values
     * @return  integer number of effected rows
     */
    public static function execute($sql, $params = array())
    {
        $statement = self::_query($sql, $params);
        return $statement->rowCount();
    }

    /**
     * Execute a statement and returns a single value
     *
     * @param   string  $sql    SQL statement
     * @param   array   $params A single value or an array of values
     * @return  mixed
     */
    public static function getValue($sql, $params = array())
    {
        $statement = self::_query($sql, $params);
        return $statement->fetchColumn(0);
    }

    /**
     * Execute a statement and returns the first row
     *
     * @param   string  $sql    SQL statement
     * @param   array   $params A single value or an array of values
     * @return  array   A result row
     */
    public static function getRow($sql, $params = array())
    {
        $statement = self::_query($sql, $params);
        return $statement->fetch(self::$_fetchMode);
    }

    /**
     * Execute a statement and returns row(s) as 2D array
     *
     * @param   string  $sql    SQL statement
     * @param   array   $params A single value or an array of values
     * @return  array   Result rows
     */
    public static function getResult($sql, $params = array())
    {
        $statement = self::_query($sql, $params);
        return $statement->fetchAll(self::$_fetchMode);
    }

    public static function getLastInsertId($sequenceName = "")
    {
        return self::$_pdo->lastInsertId($sequenceName);
    }

    public static function setFetchMode($fetchMode)
    {
        self::_connect();
        self::$_fetchMode = $fetchMode;
    }

    public static function getPDOObject()
    {
        self::_connect();
        return self::$_pdo;
    }

    public static function beginTransaction()
    {
        self::_connect();
        self::$_pdo->beginTransaction();
    }

    public static function commitTransaction()
    {
        self::$_pdo->commit();
    }

    public static function rollbackTransaction()
    {
        self::$_pdo->rollBack();
    }

    public static function setDriverOptions(array $options)
    {
        self::$_driverOptions = $options;
    }

    /* add by ou -- start -- */
    public static function quote($str)
    {
        self::$_pdo->quote($str);
    }

    public static function arrayToWhereExpr($arr, $joinBy = 'AND')
    {
        $where = array();
        foreach($filter as $k => $v) {
            $where[] = $k . '=' . self::$_pdo->quote($v);
        }
        return '(' . implode(" $joinBy ", $where) . ')';
    }
    /* add by ou -- end -- */

    private static function _connect()
    {
        if(self::$_pdo != null){
            return;
        }
        
        if(self::$_dsn == null) {
            throw new PDOException('Connection information is empty. Use Db::setConnectionInfo to set them.');
        }

        self::$_pdo = new PDO(self::$_dsn, self::$_username, self::$_password, self::$_driverOptions);
    }

    /**
     * Prepare and returns a PDOStatement
     *
     * @param   string  $sql SQL statement
     * @param   array   $params Parameters. A single value or an array of values
     * @return  PDOStatement
     */
    private static function _query($sql, $params = array())
    {
        if(self::$_pdo == null) {
            self::_connect();
        }

        $statement = self::$_pdo->prepare($sql, self::$_driverOptions);

        if (! $statement) {
            $errorInfo = self::$_pdo->errorInfo();
            throw new PDOException("Database error [{$errorInfo[0]}]: {$errorInfo[2]}, driver error code is $errorInfo[1]");
        }

        $paramsConverted = (is_array($params) ? ($params) : (array ($params )));

        if ((! $statement->execute($paramsConverted)) || ($statement->errorCode() != '00000')) {
            $errorInfo = $statement->errorInfo();
            throw new PDOException("Database error [{$errorInfo[0]}]: {$errorInfo[2]}, driver error code is $errorInfo[1]");
        }

        return $statement;
    }
}
